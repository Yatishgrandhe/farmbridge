export default function Loading() {
  return (
    <main className="min-h-screen bg-ash flex items-center justify-center px-6">
      <div className="relative flex flex-col items-center gap-6 animate-fade-in-soft">
        <div className="absolute w-48 h-48 rounded-full bg-growth/25 animate-glow-shift" />
        <div className="absolute w-36 h-36 rounded-full bg-ember/20 animate-glow-shift [animation-delay:600ms]" />

        <div className="relative z-10 flex items-center gap-2 rounded-2xl bg-soil/70 border border-wheat/15 px-5 py-4 shadow-card">
          <span className="h-2.5 w-2.5 rounded-full bg-growth animate-pulse" />
          <span className="h-2.5 w-2.5 rounded-full bg-ember animate-pulse [animation-delay:160ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-wheat/80 animate-pulse [animation-delay:320ms]" />
        </div>

        <div className="relative z-10 h-1.5 w-44 overflow-hidden rounded-full bg-wheat/10">
          <span className="block h-full w-20 rounded-full bg-ember/85 animate-shimmer-sweep" />
        </div>
        <p className="relative z-10 text-wheat/75 font-mono text-xs tracking-[0.2em] uppercase">
          Loading FarmBridge
        </p>
      </div>
    </main>
  )
}
