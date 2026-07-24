import { Share } from "@/components/icons/Share";
import { FacebookIcon, TwitterIcon, LinkedInIcon, FacebookSecondaryIcon, LinkedInSecondaryIcon } from '@/components/icons/SocialMedia';
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
          <h2 className="text-4xl md:text-5xl font-semibold text-[#181818]">Course Instructors</h2>
          <img src="/underline.png" alt="" className="w-30 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {INSTRUCTORS.map((instructor) => (
            <article key={instructor.name} className="group text-center">
              <div className="relative mb-5 overflow-hidden rounded-[12px]">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-[rgba(26,182,157,.6)] rounded-[12px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <ul className="absolute top-5 right-5 flex flex-col gap-2">
                  <li className="flex items-center justify-center group-hover:bg-white rounded-full p-2 opacity-100 border border-[#1ab69d] border-[2px]">
                    <a href="#">
                      <Share className="w-5 h-5" />
                    </a>
                  </li>
                  <li className="group/circle cursor-pointerflex items-center justify-center border border-[#ffffff] border-[2px] rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity transition-translate duration-300 delay-200 duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="Facebook">
                      <FacebookSecondaryIcon className="w-5 h-5 text-white group-hover/circle:text-[#1ab69d]" />
                    </a>
                  </li>
                  <li className="group/circle cursor-pointer flex items-center justify-center border border-[#ffffff] border-[2px] rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity transition-translate duration-300 delay-300 duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="Twitter">
                      <TwitterIcon className="w-5 h-5 text-white group-hover/circle:text-[#1ab69d]" />
                    </a>
                  </li>
                  <li className="group/circle cursor-pointer flex items-center justify-center border border-[#ffffff] border-[2px] rounded-full p-2 py-2.5 opacity-0 group-hover:opacity-100 hover:bg-white transition-opacity transition-translate duration-300 delay-400 duration-300 ease-in-out -translate-y-2 group-hover:translate-y-0">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                      className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="LinkedIn">
                      <LinkedInSecondaryIcon className="w-4 h-4 text-white group-hover/circle:text-[#1ab69d]" />
                    </a>
                  </li>
                </ul>
              </div>
              <h3 className="text-2xl font-semibold text-[#181818] mb-1">
                {instructor.name}
              </h3>
              <p className="text-[#808080] text-lg">{instructor.title}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
