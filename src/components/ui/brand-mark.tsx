type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-9 grid-cols-2 gap-1 rounded-sm border border-brass-400/45 bg-ink-900 p-1.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] ${className}`}
    >
      <span className="rounded-[1px] bg-paper-200/25" />
      <span className="rounded-[1px] bg-olive-400" />
      <span className="rounded-[1px] bg-paper-200/25" />
      <span className="rounded-[1px] border border-brass-400/70" />
    </span>
  );
}
