const realities = [
  {
    title: 'School does not always understand',
    description:
      'You send your child off and spend the day hoping the message got through. The notes home are short. The full story of how the day actually went rarely makes it back to you.',
  },
  {
    title: 'Therapy runs your whole week',
    description:
      'Speech on Tuesday, OT on Thursday, the long drive, the waiting room, the cost. You show up for every session — then try to remember it all well enough to make it count at home.',
  },
  {
    title: 'The worry never fully switches off',
    description:
      '"Is this enough? Am I doing the right things? When will my child be okay?" The questions follow you into the night, and there is rarely anyone to answer them.',
  },
  {
    title: 'And you are exhausted',
    description:
      'Between school, therapy, work, and everyone else who needs you, there is little left for yourself. You keep going anyway — because that is what this kind of love asks of you.',
  },
]

export default function Reality() {
  return (
    <section id="reality" className="relative py-24 md:py-36 bg-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb bottom-[-10%] right-[-10%] w-[600px] h-[600px] from-sky-100/70 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12 md:mb-24">
          <p className="section-label mb-5">The Reality</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 text-balance mb-6 md:mb-8 leading-[1.05]">
            Some days, it feels like you are carrying all of it alone.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
            The school pickup that did not go well. The therapy session you raced across town for. The quiet worry at 2am about whether your child will be okay.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {realities.map((item, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-b from-sky-50/60 to-white border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                <span className="text-lg font-semibold text-sky-700 group-hover:text-white transition-colors">0{index + 1}</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 mb-3 sm:mb-4">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-24 relative p-8 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-sky-50 via-white to-sky-100/60 border border-sky-100 text-center overflow-hidden">
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-radial from-sky-200/40 to-transparent blur-3xl" />
          <svg className="relative mx-auto mb-6 w-10 h-10 text-sky-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 017.17 9.5V6zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.5a1.67 1.67 0 011.67-1.67V6z" />
          </svg>
          <p className="font-display relative text-xl md:text-3xl font-medium leading-relaxed max-w-3xl mx-auto text-balance text-slate-800">
            You are not failing. You are carrying something genuinely hard — and you deserve a companion who sees all of it.
          </p>
        </div>
      </div>
    </section>
  )
}
