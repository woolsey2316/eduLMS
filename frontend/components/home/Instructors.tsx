const INSTRUCTORS = [
  {
    name: 'Jane Seymour',
    title: 'UI Designer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
  },
  {
    name: 'Edward Norton',
    title: 'Web Developer',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
  },
  {
    name: 'Penelope Cruz',
    title: 'Digital Marketer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  },
  {
    name: 'John Travolta',
    title: 'Business Coach',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
];

export default function Instructors() {
  return (
    <section className="relative bg-white py-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute top-10 left-8 w-24 opacity-40 pointer-events-none" />
      <span className="absolute top-24 right-[15%] w-3 h-3 rounded-full bg-[#f8b81f]" />
      <span className="absolute bottom-32 left-[10%] w-2.5 h-2.5 rounded-full bg-[#ee4a62]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#181818] mb-3">Course Instructors</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INSTRUCTORS.map((instructor) => (
            <article key={instructor.name} className="group text-center">
              <div className="relative mb-5 overflow-hidden rounded-[5px]">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#1ab69d] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#181818] mb-1 group-hover:text-[#1ab69d] transition-colors">
                {instructor.name}
              </h3>
              <p className="text-gray-500 text-sm">{instructor.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
