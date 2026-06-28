export default function PhoneFrame({ src, alt, className = '' }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="relative bg-stone-900 rounded-[2.2rem] p-[10px] phone-shadow transition-transform duration-500 hover:scale-[1.02] hover:-translate-y-1">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-b-2xl z-10" />
        <div className="rounded-[1.8rem] overflow-hidden bg-white">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-stone-900/20 blur-xl rounded-full -z-10 transition-all duration-500 group-hover:w-[80%] group-hover:bg-stone-900/30" />
    </div>
  )
}
