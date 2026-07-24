const PARTNERS = [
  { name: 'Coursera', color: '#0056D2' },
  { name: 'Udemy', color: '#A435F0' },
  { name: 'Khan', color: '#14BF96' },
  { name: 'edX', color: '#02262B' },
  { name: 'Skillshare', color: '#00FF84', bg: '#000' },
  { name: 'MasterClass', color: '#1A1A1A' },
  { name: 'Codecademy', color: '#1F4056' },
  { name: 'FutureLearn', color: '#DE00A5' },
];

export default function Partners() {
  return (
    <section className="relative bg-white py-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute bottom-10 right-8 w-24 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-4">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#181818] leading-tight">
            Learn with Our Partners
          </h2>
          <img src="/underline.png" alt="Partners" className="w-30 h-full object-cover" />
          <p className="text-[#808080] text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4">
          {PARTNERS.map((partner, index) => (
            <div
              key={partner.name}
              className="bg-white shadow-[0px_6px_24px_0px_rgba(26,46,85,0.06)] flex items-center justify-center hover:shadow-[0px_10px_30px_0px_rgba(26,46,85,0.1)] transition-shadow"
            >
              <img src={`/brand-0${index + 1}.png`} alt={partner.name} className="w-[120px] h-[120px] object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
