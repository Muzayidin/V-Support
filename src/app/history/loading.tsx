export default function HistoryLoading() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 pb-28 md:max-w-md md:mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-12">
        <div className="w-32 h-6 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
        <div className="w-24 h-8 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]" />
      </div>

      {/* Summary Box */}
      <div className="bg-secondary-background p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex justify-between">
        <div className="space-y-1.5">
          <div className="w-16 h-3 bg-background rounded" />
          <div className="w-24 h-6 bg-background rounded" />
        </div>
        <div className="space-y-1.5 text-right">
          <div className="w-20 h-3 bg-background rounded ml-auto" />
          <div className="w-28 h-6 bg-background rounded" />
        </div>
      </div>

      {/* Service Record Items */}
      <div className="space-y-3 mt-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-secondary-background p-4 rounded-[var(--radius-base)] border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-background rounded" />
              <div className="w-16 h-3.5 bg-background rounded" />
            </div>
            <div className="w-36 h-3 bg-background rounded" />
            <div className="pt-2 border-t border-border/50 flex justify-between">
              <div className="w-20 h-3 bg-background rounded" />
              <div className="w-24 h-4 bg-background rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
