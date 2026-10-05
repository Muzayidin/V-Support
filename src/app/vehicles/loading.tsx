export default function VehiclesLoading() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 pb-28 md:max-w-md md:mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-12">
        <div className="w-32 h-6 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
        <div className="w-28 h-8 bg-secondary-background border-2 border-border rounded-[var(--radius-base)] shadow-[2px_2px_0px_0px_var(--border)]" />
      </div>

      {/* Vehicle Cards */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-secondary-background p-5 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="w-36 h-5 bg-background rounded" />
                <div className="w-20 h-3 bg-background rounded" />
              </div>
              <div className="w-12 h-6 bg-background rounded border border-border" />
            </div>

            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="h-12 bg-background rounded border border-border" />
              <div className="h-12 bg-background rounded border border-border" />
              <div className="h-12 bg-background rounded border border-border" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-background rounded border-2 border-border" />
              <div className="w-10 h-9 bg-background rounded border-2 border-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
