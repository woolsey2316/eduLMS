const FEATURES = [
  'Expert Trainers',
  'Online Remote Learning',
  'Lifetime Access',
];

export default function LearnGrow() {
  return (
    <section className="relative bg-[#fff] py-20 font-spartan overflow-hidden">
      {/* Decorative accents */}
      <span className="absolute top-16 right-[12%] w-4 h-4 rounded-full bg-[#f8b81f] opacity-80" />
      <span className="absolute top-40 right-[8%] w-2.5 h-2.5 rounded-full bg-[#ee4a62] opacity-70" />
      <img src="/shape-13.png" alt="" className="absolute bottom-20 left-6 w-28 opacity-50 pointer-events-none" />
      <img src="/shape-16.png" alt="" className="absolute top-12 left-[40%] w-16 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — image collage */}
        <div className="relative flex justify-center lg:justify-start">
          <div className="relative w-full max-w-[480px]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&h=560&fit=crop"
              alt="Students learning online"
              className="w-full h-[360px] md:h-[420px] object-cover rounded-[10px] shadow-[0px_20px_60px_0px_rgba(26,46,85,0.15)]"
            />

            {/* Floating video thumbnail */}
            <div className="absolute -top-6 -right-4 md:right-0 w-36 h-24 md:w-44 md:h-28 rounded-[5px] overflow-hidden shadow-lg border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop"
                alt="Course preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1ab69d">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enrolled badge */}
            <div className="absolute -bottom-5 left-6 md:left-10 bg-white rounded-[25px] shadow-[0px_10px_40px_0px_rgba(26,46,85,0.12)] px-4 py-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i + 10}`}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-[#181818]">2K+</p>
                <p className="text-xs text-gray-500">Enrolled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — copy */}
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#181818] leading-tight mb-5">
            Learn & Grow Your Skills From{' '}
            <span className="text-[#ee4a62]">Anywhere</span>
          </h2>
          <p className="text-[#6a7282] text-[15px] font-poppins leading-relaxed mb-8 max-w-md">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <ul className="space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <img src="/tick.png" alt="" className="w-6 h-6" />
                <span className="text-[#181818] font-normal text-[19px] font-spartan">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
