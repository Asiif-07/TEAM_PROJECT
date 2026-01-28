import HowItWorksHero from "../components/ui/HowItWorksHero.jsx";
import ProcessSection from "../components/ui/ProcessSection.jsx";
import FAQSection from "../components/ui/FAQSection.jsx";
import Dream from "../components/ui/Dream.jsx";

function HowItWorksPage() {
  return (
    <>
      <HowItWorksHero />
      {/* Custom heading for How It Works page only */}
      <section className="bg-[#FCFDFF] pt-20 pb-4 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
          Our Revolutionary{" "}
          <span className="text-blue-600">4-Step Process</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base font-medium leading-relaxed text-slate-500">
          Experience the perfect blend of artificial intelligence and human
          expertise for your career success.
        </p>
      </section>
      <ProcessSection showHeading={false} />
      <FAQSection/>
      <Dream/>
    </>
  );
}

export default HowItWorksPage;
