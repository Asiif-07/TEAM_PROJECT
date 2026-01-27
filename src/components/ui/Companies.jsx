import logos from "../../assets/images/logos.png";

export default function Companies() {
  return (
    <section className="w-full bg-white ">
      {/* Trusted by text */}
      <p className="text-center text-[13px] text-gray-500 mb-8">
        Trusted by professionals who landed jobs at
      </p>

      {/* Company names */}
      {/* <div className="flex justify-center gap-10 mb-6 text-[14px] font-medium text-gray-900">
        <span>Boltshift</span>
        <span>FeatherDev</span>
        <span>Spherule</span>
        <span>GlobalBank</span>
        <span>Nietzsche</span>
      </div> */}

      {/* Logos image */}
      <div className="flex justify-center mb-24">
        <img
          src={logos}
          alt="Boltshift, FeatherDev, Spherule, GlobalBank, Nietzsche logos"
          className="max-w-full h-auto"
        />
      </div>
{/* 
      {/* How it works
      <div className="max-w-[640px] mx-auto text-center">
        <h2 className="text-[36px] leading-[44px] font-semibold mb-4">
          How <span className="text-blue-600">It works</span>
        </h2>

        <p className="text-gray-500 text-[16px] leading-[24px]">
          Quickly upload, customize, and download your resume tailored to any
          job description in no time
        </p>
      </div> */}
    </section>
  );
}
