export default function TaxLoading() {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 pb-28 md:max-w-md md:mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-12">
        <div className="w-32 h-6 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
        <div className="w-20 h-7 bg-secondary-background border-2 border-border rounded-[var(--radius-base)]" />
      </div>

      {/* Tax Card Skeleton */}
      <div className="bg-secondary-background p-5 rounded-[var(--radius-base)] border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] space-y-4">
        <div className="w-28 h-4 bg-background rounded" />
        <div className="h-20 bg-background rounded border-2 border-border" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-14 bg-background rounded border border-border" />
          <div className="h-14 bg-background rounded border border-border" />
        </div>
      </div>
    </div>
  )
}
