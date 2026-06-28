export default function Stores() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-sky-50/60 to-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-[2rem] px-6 py-6 sm:px-8 sm:py-7 md:px-12 md:py-9 bg-white/70 backdrop-blur-xl border border-white/80 shadow-xl shadow-sky-900/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-base md:text-lg font-semibold text-slate-900">
              Coming soon to your pocket.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Prelaunch app — available on App Store and Google Play.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-80">Download on the</p>
                <p className="text-sm font-semibold leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl hover:bg-sky-50 hover:border-sky-200 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <svg className="w-6 h-6" viewBox="0 0 512 512">
                <path fill="#00C3FF" d="M48 64.4v383.2c0 4.8 5.3 7.8 9.4 5.3l242-141.3L48 64.4z" />
                <path fill="#FFDE46" d="M299.4 200.4L86.3 75.6c-4.1-2.5-9.4.5-9.4 5.3v.4l222.5 230.7v-111.6z" />
                <path fill="#FF3648" d="M76.9 431.1l222.5-230.7v111.6L76.9 431.1z" />
                <path fill="#00E89D" d="M48 64.4v383.2c0 4.8 5.3 7.8 9.4 5.3L299.4 311.6 48 64.4z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] leading-none opacity-70">Get it on</p>
                <p className="text-sm font-semibold leading-tight">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
