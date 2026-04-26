export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 py-32 animate-fade-in-soft">
        <div className="h-10 w-72 rounded bg-wheat/10 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-44 rounded-2xl bg-soil/60 border border-wheat/10" />
            <div className="h-44 rounded-2xl bg-soil/60 border border-wheat/10" />
          </div>
          <div className="space-y-4">
            <div className="h-44 rounded-2xl bg-soil/60 border border-wheat/10 animate-float-gentle" />
            <div className="h-44 rounded-2xl bg-soil/60 border border-wheat/10" />
          </div>
        </div>
      </div>
    </main>
  )
}
