const footerLinks = [
  {
    title: 'Navigate',
    links: [
      { name: 'The Reality', href: '/#reality' },
      { name: 'Our Belief', href: '/#belief' },
      { name: 'Awareness', href: '/#awareness' },
      { name: 'Join Waitlist', href: '/#waitlist' },
    ],
  },
  {
    title: 'More',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'Contact', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-white to-sky-50 border-t border-sky-100 text-slate-700 py-12 md:py-20 overflow-hidden">
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-sky-200/30 to-transparent blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.svg" alt="Sarathi" className="h-11 w-auto" />
              <span className="font-display text-2xl font-bold text-slate-900">Sarathi</span>
            </div>
            <p className="text-slate-700 leading-relaxed max-w-md text-base sm:text-lg">
              Your guide. Your companion. Your Sarathi.
            </p>
            <p className="text-slate-500 mt-4 text-sm max-w-md">
              Built for parents of autistic children — so every small moment finds its meaning.
            </p>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-6 sm:gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold tracking-extra-wide uppercase text-sky-600 mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-slate-600 hover:text-sky-600 transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-sky-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2025 Sarathi. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Built with care, for the families who need it most.
          </p>
        </div>
      </div>
    </footer>
  )
}
