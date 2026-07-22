import Link from 'next/link';

export default function CertificateCTA() {
  return (
    <section className="relative bg-[#f0f4f5] py-20 font-spartan overflow-hidden">
      {/* Soft circular patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#1ab69d]/15" />
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#1ab69d]/20" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-[#ee4a62]/10" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[#ee4a62]/15" />
      </div>
      <img src="/shape-16.png" alt="" className="absolute top-8 left-[20%] w-14 opacity-40 pointer-events-none" />
      <img src="/shape-18.png" alt="" className="absolute bottom-8 right-[18%] w-16 opacity-40 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#181818] leading-tight mb-8">
          Get Your Quality Skills{' '}
          <span className="text-[#ee4a62]">Certificate</span> Through EduLMS
        </h2>
        <Link
          href="/courses"
          className="group inline-flex items-center gap-2 bg-[#1ab69d] text-white font-medium px-8 py-4 rounded-[5px] relative overflow-hidden"
        >
          <span className="relative z-10">Get Started Now</span>
          <span className="absolute inset-0 bg-[linear-gradient(-90deg,#31b978,#1ab69d)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
        </Link>
      </div>
    </section>
  );
}
