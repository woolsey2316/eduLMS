const STATS = [
  { value: '45.2K', label: 'Students Enrolled', accent: '#1ab69d' },
  { value: '32.4K', label: 'Finished Sessions', accent: '#ee4a62' },
  { value: '354+', label: 'Online Instructors', accent: '#f8b81f' },
  { value: '100%', label: 'Satisfaction Rate', accent: '#1ab69d' },
];

export default function StatsCard() {
  return (
    <section className="relative z-20 px-4 font-spartan -mb-0">
      <div className="max-w-3xl mx-auto bg-white rounded-[5px] shadow-[0px_20px_60px_0px_rgba(26,46,85,0.12)] px-6 py-10 md:px-12 md:py-12">
        <div className="grid grid-cols-2 gap-0 text-center">
          {STATS.map((stat) => (
            <div className="odd:border-r [&:nth-child(-n+2)]:border-b border-[#eaf0f2] py-8" key={stat.label}>
              <p className="text-4xl md:text-5xl font-semibold mb-1" style={{ color: stat.accent }}>
                {stat.value}
              </p>
              <p className="text-[#181818] uppercase text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
