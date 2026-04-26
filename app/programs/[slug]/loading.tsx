export default function ProgramDetailLoading() {
  return (
    <main className="min-h-screen bg-ash">
      <div className="container mx-auto px-6 py-24 max-w-4xl animate-fade-in-soft">
        <div className="h-4 w-40 rounded bg-wheat/10 mb-10" />
        <div className="h-10 w-4/5 rounded bg-wheat/10 mb-5" />
        <div className="h-5 w-full rounded bg-wheat/10 mb-3" />
        <div className="h-5 w-11/12 rounded bg-wheat/10 mb-12" />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="h-56 rounded-2xl bg-soil/60 border border-wheat/10" />
            <div className="h-56 rounded-2xl bg-soil/60 border border-wheat/10" />
          </div>
          <div className="h-72 rounded-2xl bg-soil/60 border border-wheat/10 animate-float-gentle" />
        </div>
      </div>
    </main>
  )
}
