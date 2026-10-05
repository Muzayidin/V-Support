export default function ProfileLoading() {
  return (
    <div className="px-4 py-5 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between h-12">
        <div className="w-28 h-6 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
        <div className="w-16 h-7 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
      </div>

      {/* User Card Skeleton */}
      <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 border-2 border-border shadow-[5px_5px_0px_0px_var(--border)] flex items-center gap-4">
        <div className="w-16 h-16 rounded-[var(--radius-base)] border-2 border-border bg-background" />
        <div className="space-y-2 flex-1">
          <div className="w-32 h-5 bg-background rounded" />
          <div className="w-40 h-3.5 bg-background rounded" />
          <div className="w-20 h-4 bg-background rounded" />
        </div>
      </div>

      {/* Settings list skeletons */}
      <div className="space-y-2">
        <div className="w-28 h-3.5 bg-secondary-background rounded" />
        <div className="bg-secondary-background rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] divide-y-2 divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-background border-2 border-border" />
                <div className="space-y-1">
                  <div className="w-24 h-3.5 bg-background rounded" />
                  <div className="w-32 h-2.5 bg-background rounded" />
                </div>
              </div>
              <div className="w-4 h-4 bg-background rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
