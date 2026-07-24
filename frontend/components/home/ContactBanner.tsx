export default function ContactBanner() {
  return (
    <section className="px-4 pb-4 font-spartan">
      <div className="max-w-4xl mx-auto bg-[linear-gradient(-90deg,#31b978,#1ab69d)] rounded-lg ">
        <div className="bg-[url('/contours.png')] bg-cover bg-center w-full h-[170px] px-6 md:px-12 py-5 md:py-6 flex flex-col sm:flex-row items-center justify-center gap-[30px]">
          <div className="">
            <h3 className="text-white text-2xl font-normal text-right">Get in Touch:</h3>
            <a
              href="mailto:info@edulms.com"
                className="text-white text-2xl md:text-3xl font-semibold hover:opacity-90 transition-opacity text-center sm:text-left"
              >
                info@edulms.com
            </a>
          </div>

          <div className="flex items-center justify-center h-[70px] w-[70px] flex-shrink-0">
            <span className="h-[70px] w-[70px] text-center font-poppins leading-[60px] text-[#1ab69d] bg-white rounded-full font-semibold text-2xl border-[4px] border-[rgba(26,182,157,.2)]">or</span>
          </div>
          <div className="">
            <h3 className="text-white text-2xl font-normal">Call Us Via:</h3>
            <a
              href="tel:+011234567222"
              className="text-white text-2xl md:text-3xl font-semibold hover:opacity-90 transition-opacity text-center sm:text-right"
            >
              +01123 4567 222
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
