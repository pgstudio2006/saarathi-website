const beliefs = [
  {
    number: '01',
    title: 'Parents are the experts.',
    description:
      'No clinician, algorithm, or framework knows your child the way you do. Every tool we build begins with that truth.',
  },
  {
    number: '02',
    title: 'Observation is not a task.',
    description:
      'It is something every parent already does, every single day. We build tools worthy of that effort.',
  },
  {
    number: '03',
    title: 'Development is not a race.',
    description:
      'There is no behind. There is only this child, on this journey, at this moment.',
  },
  {
    number: '04',
    title: 'The best outcomes happen together.',
    description:
      'When parents, therapists, and teachers share the same picture. Alignment is not optional — it is the work.',
  },
  {
    number: '05',
    title: 'Technology should disappear.',
    description:
      'You should only ever feel the presence of support — never the weight of a system.',
  },
]

export default function Beliefs() {
  return (
    <section id="belief" className="relative py-24 md:py-36 bg-gradient-to-b from-white to-sky-50/60 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="gradient-orb top-[-15%] left-[-10%] w-[500px] h-[500px] from-sky-200/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 md:mb-24 max-w-3xl">
          <p className="section-label mb-5">Our Belief</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 text-balance mb-5 md:mb-6 leading-[1.05]">
            What we know to be true.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
            Sarathi was not built around technology. It was built around a family. These are the principles that guide everything we make.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {beliefs.map((belief, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white/70 backdrop-blur-sm hover:bg-white hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-display text-4xl font-bold bg-gradient-to-br from-sky-300 to-sky-500 bg-clip-text text-transparent opacity-50 group-hover:opacity-100 transition-opacity">
                {belief.number}
              </span>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-slate-900 mt-5 sm:mt-6 mb-3 leading-tight">
                {belief.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {belief.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
