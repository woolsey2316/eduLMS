import Link from 'next/link';

const TESTIMONIALS = [
  {
    quote:
      'Lorem ipsum dolor amet consec tur elit adicing sed do usmod zx tempor enim minim veniam quis nostrud exer citation.',
    name: 'Ray Sanchez',
    role: 'Student',
    avatar: 'https://i.pravatar.cc/80?img=12',
    rating: 5,
  },
  {
    quote:
      'Lorem ipsum dolor amet consec tur elit adicing sed do usmod zx tempor enim minim veniam quis nostrud exer citation.',
    name: 'Thomas Carter',
    role: 'Student',
    avatar: 'https://i.pravatar.cc/80?img=33',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="relative pt-8 pb-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute top-16 right-10 w-24 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left copy */}
        <div className="lg:col-span-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#181818] leading-tight mb-4">
            What Our Students Have To Say
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 bg-[#1ab69d] text-white font-medium px-7 py-3.5 rounded-[5px] relative overflow-hidden"
          >
            <span className="relative z-10">View All</span>
            <span className="absolute inset-0 bg-[linear-gradient(-90deg,#31b978,#1ab69d)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
          </Link>
        </div>

        {/* Testimonial cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="bg-white rounded-[5px] border border-gray-100 shadow-[0px_10px_40px_0px_rgba(26,46,85,0.08)] p-7 flex flex-col"
            >
              <p className="text-gray-500 text-base leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#181818]">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
                <span className="text-[#f8b81f] text-sm tracking-tight">
                  {'★'.repeat(t.rating)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
