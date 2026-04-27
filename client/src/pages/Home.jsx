import WhyChooseSection from "../components/sections/WhyChoose.jsx";
import Companies from "../components/sections/Companies.jsx";
import HeroSection from "../components/sections/HeroSection.jsx";
import Features from "../components/sections/Features.jsx";
import Vector from "../components/common/Vector.jsx";
import SuccessStories from "../components/sections/SuccessStory.jsx";
import Services from "../components/sections/Services.jsx";
import FeatureSection from "../components/sections/FeatureServices.jsx";
import ProcessSection from "../components/sections/ProcessSection.jsx";
import Dream from "../components/sections/Dream.jsx";
function HomePage() {
    return (

        <>
            <HeroSection />
            <Companies />
            <ProcessSection />
            <WhyChooseSection />
            <Features />
            <Services />
            <FeatureSection />
            <Vector />
            <SuccessStories />
            <Dream />

        </>

    );
}

export default HomePage;
