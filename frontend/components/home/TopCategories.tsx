import Link from 'next/link';
import { UserSpeakingIcon } from '@/components/icons/UserSpeaking';
import { PenTool } from '@/components/icons/PenTool';
import { Terminal } from '@/components/icons/Terminal';
import { Servers } from '@/components/icons/Servers';
import { Laptop } from '@/components/icons/Laptop';
import { Pill } from '@/components/icons/Pill';
import { Megaphone } from '@/components/icons/Megaphone';
import { Handshake } from '@/components/icons/Handshake';
import { Picture } from '@/components/icons/Picture';
const CATEGORIES = [
  { name: 'Personal Development', icon: Terminal, bgHover: 'hover:bg-lime', bg: 'bg-lime-500/10', color: '#fff' },
  { name: 'Arts & Design', icon: PenTool, bgHover: 'hover:bg-red', bg: 'bg-red-500/10', color: '#fff' },
  { name: 'Data Science', icon: Servers, bgHover: 'hover:bg-purple', bg: 'bg-purple-500/10', color: '#fff' },
  { name: 'Business Management', icon: UserSpeakingIcon, bgHover: 'hover:bg-green', bg: 'bg-green-500/10', color: '#fff' },
  { name: 'Computer Science', icon: Laptop, bgHover: 'hover:bg-orange', bg: 'bg-orange-500/10', color: '#fff' },
  { name: 'Health & Fitness', icon: Pill, bgHover: 'hover:bg-yellow', bg: 'bg-yellow-500/10', color: '#fff' },
  { name: 'Marketing', icon: Megaphone, bgHover: 'hover:bg-pink', bg: 'bg-pink-500/10', color: '#fff' },
  { name: 'Business & Finance', icon: Handshake, bgHover: 'hover:bg-blue', bg: 'bg-blue-500/10', color: '#fff' },
  { name: 'Photography', icon: Picture, bgHover: 'hover:bg-teal', bg: 'bg-teal-500/10', color: '#fff' },
];

export default function TopCategories() {
  return (
    <section className="relative bg-white py-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute top-10 left-8 w-24 opacity-40 pointer-events-none" />
      <img src="/shape-13.png" alt="" className="absolute bottom-10 right-8 w-28 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#181818] mb-0">Top Categories</h2>
          <img src="/underline.png" alt="" className="w-30 mx-auto" />
          <p className="text-[#808080] text-base max-w-lg mx-auto font-poppins text-[15px]">
            Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/courses?category=${encodeURIComponent(cat.name)}`}
                className={`group flex items-center gap-4 ${cat.bg} ${cat.bgHover} rounded-[5px] border border-gray-100 shadow-[0px_10px_40px_0px_rgba(26,46,85,0.07)] px-5 py-5 hover:shadow-[0px_14px_50px_0px_rgba(26,46,85,0.12)] hover:-translate-y-0.5 transition-all duration-300`}
              >
                <div
                  className="w-14 h-14 rounded-[5px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                >
                  <Icon color={cat.color} />
                </div>
                <span className="text-lg font-medium text-[#181818] group-hover:text-[#fff] transition-colors">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
