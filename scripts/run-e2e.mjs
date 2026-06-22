import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const projectRoot = process.cwd();
const port = "3100";
const baseURL = `http://127.0.0.1:${port}`;
const nextCli = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);
const playwrightCli = path.join(
  projectRoot,
  "node_modules",
  "@playwright",
  "test",
  "cli.js",
);

const server = spawn(
  process.execPath,
  [nextCli, "start", "--hostname", "127.0.0.1", "--port", port],
  {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
    windowsHide: true,
  },
);
const serverExit = once(server, "exit");

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(
        `Next.js exited before the smoke test started (code ${server.exitCode}).`,
      );
    }

    try {
      const response = await fetch(baseURL);
      if (response.ok) {
        return;
      }
    } catch {
      // The production server is still starting.
    }

    await delay(250);
  }

  throw new Error(`Timed out waiting for the production server at ${baseURL}.`);
}

async function stopServer() {
  if (server.exitCode !== null) {
    return;
  }

  server.kill();
  await Promise.race([serverExit, delay(5_000)]);

  if (server.exitCode === null) {
    server.kill("SIGKILL");
    await serverExit;
  }
}

try {
  await waitForServer();

  const tests = spawn(process.execPath, [playwrightCli, "test"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: baseURL,
      PLAYWRIGHT_BROWSERS_PATH: path.join(projectRoot, ".playwright-browsers"),
    },
    stdio: "inherit",
    windowsHide: true,
  });

  const [testExitCode] = await once(tests, "exit");
  process.exitCode = typeof testExitCode === "number" ? testExitCode : 1;
} finally {
  await stopServer();
}
