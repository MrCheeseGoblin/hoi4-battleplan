export type GameDataIssueCode =
  | "broken-reference"
  | "duplicate-id"
  | "file-not-found"
  | "invalid-json"
  | "schema"
  | "unexpected-entry"
  | "version-mismatch";

export type GameDataIssue = {
  code: GameDataIssueCode;
  file: string;
  field?: string;
  message: string;
};

function formatIssue(issue: GameDataIssue) {
  const location = issue.field ? `${issue.file}:${issue.field}` : issue.file;
  return `${location} [${issue.code}] ${issue.message}`;
}

export class GameDataValidationError extends Error {
  readonly issues: GameDataIssue[];

  constructor(issues: GameDataIssue[]) {
    super(
      `Game-data validation failed with ${issues.length} ${
        issues.length === 1 ? "issue" : "issues"
      }.\n${issues.map(formatIssue).join("\n")}`,
    );
    this.name = "GameDataValidationError";
    this.issues = issues;
  }
}
