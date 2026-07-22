import Link from 'next/link';

const CATEGORIES = [
  { name: 'Personal Development', icon: PersonIcon, bg: '#E7F8F3', color: '#1ab69d' },
  { name: 'Art & Design', icon: PaletteIcon, bg: '#FDEBEC', color: '#ee4a62' },
  { name: 'Data Science', icon: ChartIcon, bg: '#FFF4E5', color: '#f8b81f' },
  { name: 'Business Management', icon: BriefcaseIcon, bg: '#E8F0FE', color: '#4B72FA' },
  { name: 'Computer Science', icon: CodeIcon, bg: '#F3E8FF', color: '#9B59B6' },
  { name: 'Health & Fitness', icon: HeartIcon, bg: '#FFE8F0', color: '#E91E8C' },
  { name: 'Marketing', icon: MegaphoneIcon, bg: '#E8FAF0', color: '#31b978' },
  { name: 'Business & Finance', icon: FinanceIcon, bg: '#FFF0E8', color: '#FF6B35' },
  { name: 'Photography', icon: CameraIcon, bg: '#E8F4FF', color: '#2196F3' },
];

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
  );
}

function PaletteIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" />
      <circle cx="7.5" cy="11.5" r="1.2" fill={color} stroke="none" />
      <circle cx="10.5" cy="7.5" r="1.2" fill={color} stroke="none" />
      <circle cx="14.5" cy="7.5" r="1.2" fill={color} stroke="none" />
      <circle cx="17" cy="11" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}

function ChartIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

function BriefcaseIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 13h20" />
    </svg>
  );
}

function CodeIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function MegaphoneIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l18-5v12L3 13v-2zM11.6 16.8a3 3 0 11-5.2-3" />
    </svg>
  );
}

function FinanceIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 7v10M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
    </svg>
  );
}

function CameraIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function TopCategories() {
  return (
    <section className="relative bg-white py-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute top-10 left-8 w-24 opacity-40 pointer-events-none" />
      <img src="/shape-13.png" alt="" className="absolute bottom-10 right-8 w-28 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#181818] mb-3">Top Categories</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
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
                className="group flex items-center gap-4 bg-white rounded-[5px] border border-gray-100 shadow-[0px_10px_40px_0px_rgba(26,46,85,0.07)] px-5 py-5 hover:shadow-[0px_14px_50px_0px_rgba(26,46,85,0.12)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-[5px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: cat.bg }}
                >
                  <Icon color={cat.color} />
                </div>
                <span className="text-lg font-semibold text-[#181818] group-hover:text-[#1ab69d] transition-colors">
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
