export default function ContactBanner() {
  return (
    <section className="px-4 pb-4 font-spartan">
      <div className="max-w-5xl mx-auto bg-[linear-gradient(-90deg,#31b978,#1ab69d)] rounded-full px-6 md:px-12 py-5 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href="mailto:info@edulms.com"
          className="text-white text-base md:text-lg font-medium hover:opacity-90 transition-opacity text-center sm:text-left"
        >
          For help? <span className="font-semibold">info@edulms.com</span>
        </a>

        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1ab69d" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
            />
          </svg>
        </div>

        <a
          href="tel:+011234567222"
          className="text-white text-base md:text-lg font-medium hover:opacity-90 transition-opacity text-center sm:text-right"
        >
          Call Us: <span className="font-semibold">+01123 4567 222</span>
        </a>
      </div>
    </section>
  );
}
