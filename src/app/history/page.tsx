import prisma from '@/lib/prisma'

export default async function History() {
  // Ambil vehicle dummy untuk MVP
  const vehicle = await prisma.vehicle.findFirst()
  let history: any[] = []
  
  if (vehicle) {
    history = await prisma.serviceRecord.findMany({
      where: { vehicleId: vehicle.id },
      include: { details: true },
      orderBy: { date: 'desc' }
    })
  }

  return (
    <>
      <header className="w-full top-0 sticky z-40 bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:max-w-md md:mx-auto">
        <div className="flex justify-between items-center px-margin-page h-14 w-full">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary font-bold" data-weight="fill">motorcycle</span>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight">V-Support</h1>
          </div>
          <div className="text-on-surface-variant font-body-md text-body-md">
            {vehicle?.name || 'Kendaraan'}
          </div>
        </div>
      </header>

      <main className="flex-1 px-margin-page py-6 pb-[calc(56px+1.5rem)]">
        {/* Header & Search */}
        <div className="mb-6 space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-primary">Riwayat Servis</h2>
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                type="text"
                placeholder="Cari riwayat..." 
                className="w-full h-touch-target-min pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-shadow shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              />
            </div>
            <button className="h-touch-target-min w-touch-target-min flex items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low active:bg-surface-container-high transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        {history.length === 0 ? (
          <div className="text-center text-text-muted mt-10 font-body-md text-body-md">
            Belum ada riwayat servis.
          </div>
        ) : (
          <div className="relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-outline-variant/50 space-y-6">
            {history.map((record, index) => {
              const dateStr = record.date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
              const componentsStr = record.details.map((d: any) => d.componentName).join(', ')
              const isLatest = index === 0

              return (
                <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  {/* Icon Marker */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-surface-bg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ${
                    isLatest 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined">build</span>
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-card rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-surface-container-highest flex flex-col gap-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-label-bold text-label-bold ${isLatest ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {dateStr}
                      </span>
                      <span className="font-label-sm text-label-sm text-text-muted bg-surface-container-low px-2 py-0.5 rounded-full whitespace-nowrap">
                        {record.mileage.toLocaleString('id-ID')} KM
                      </span>
                    </div>
                    <div className="font-body-md text-body-md text-on-surface line-clamp-2">
                      {componentsStr}
                    </div>
                    <div className="font-headline-md text-headline-md text-on-surface mt-2 text-right">
                      Rp {record.totalCost.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
