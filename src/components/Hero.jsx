import PhoneFrame from './PhoneFrame'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden">
      <img
        src="/background.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-50/40 via-white/10 to-sky-100/50" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="order-2 lg:order-1 animate-fade-up">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 text-balance mb-6 leading-[1.05]">
              Meet Sarathi.<br />
              <span className="bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent font-medium">
                Every small moment matters.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-md text-balance mb-9 leading-relaxed">
              You notice everything about your child. We are building something that helps those moments find their meaning.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-3xl sm:rounded-full bg-white/60 backdrop-blur-sm border border-white/70 shadow-sm shadow-sky-900/5 max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 pl-5 pr-4 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all whitespace-nowrap"
              >
                Join waitlist
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </form>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end items-center h-[380px] sm:h-[480px] md:h-[580px] animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute inset-0 flex items-center justify-center -z-0">
              <div className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-tr from-white/40 via-sky-100/30 to-transparent blur-3xl" />
            </div>
            <div className="relative flex items-center justify-center w-full max-w-xl perspective-[1400px] animate-float">
              <div className="absolute left-0 sm:left-2 md:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[230px] origin-bottom-right -rotate-[16deg] md:-rotate-[18deg] opacity-95 z-0">
                <PhoneFrame src="/03_Anchor (1).svg" alt="Anchor screen one" />
              </div>
              <div className="relative w-[150px] sm:w-[190px] md:w-[240px] lg:w-[280px] z-10">
                <PhoneFrame src="/03_Anchor.svg" alt="Anchor main screen" />
              </div>
              <div className="absolute right-0 sm:right-2 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[230px] origin-bottom-left rotate-[16deg] md:rotate-[18deg] opacity-95 z-0">
                <PhoneFrame src="/03_Anchor (2).svg" alt="Anchor screen two" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <span className="text-[10px] uppercase tracking-extra-wide text-slate-500">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent" />
      </div>
    </section>
  )
}
