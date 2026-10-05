export default function DashboardLoading() {
  return (
    <div className="px-4 py-4 flex flex-col gap-5 pb-28 md:max-w-md md:mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[var(--radius-base)] bg-secondary-background border-2 border-border shadow-[2px_2px_0px_0px_var(--border)]" />
          <div className="w-24 h-5 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
        </div>
        <div className="w-28 h-8 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]" />
      </div>

      {/* Vehicle Card Skeleton */}
      <div className="bg-secondary-background rounded-[var(--radius-base)] p-5 border-2 border-border shadow-[5px_5px_0px_0px_var(--border)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-36 h-5 bg-background border border-border rounded" />
          <div className="w-16 h-4 bg-background border border-border rounded" />
        </div>
        
        {/* Odometer Big Box */}
        <div className="p-4 bg-background border-2 border-border rounded-[var(--radius-base)] flex items-center justify-between shadow-[2px_2px_0px_0px_var(--border)]">
          <div className="space-y-2">
            <div className="w-20 h-3 bg-secondary-background rounded" />
            <div className="w-32 h-7 bg-secondary-background rounded" />
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-background border border-border" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-10 bg-background border-2 border-border rounded-[var(--radius-base)]" />
          <div className="h-10 bg-background border-2 border-border rounded-[var(--radius-base)]" />
        </div>
      </div>

      {/* Component Status Grid Skeleton */}
      <div className="space-y-2">
        <div className="w-28 h-4 bg-secondary-background border border-border rounded" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-secondary-background rounded-[var(--radius-base)] p-3.5 border-2 border-border shadow-[3px_3px_0px_0px_var(--border)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-3.5 bg-background rounded" />
                <div className="w-7 h-7 rounded bg-background border border-border" />
              </div>
              <div className="w-full h-2.5 bg-background border border-border rounded-full" />
              <div className="w-20 h-3 bg-background rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
