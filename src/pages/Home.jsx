// import Banner from "../components/ui/Banner.jsx";
import WhyChooseSection from "../components/ui/whychoose.jsx";

import Companies from "../components/ui/Companies";
import HeroSection from "../components/ui/HeroSection.jsx";
import Features from "../components/ui/Features.jsx";
import Vector from "../components/ui/Vector.jsx";
import SuccessStories from "../components/ui/Successstory.jsx";
import Services from "../components/ui/Services.jsx";
import FeatureSection from "../components/ui/Feature_services.jsx";
import ProcessSection from "../components/ui/ProcessSection.jsx";
import Dream from "../components/ui/Dream.jsx";

// import Services from "../components/ui/Services.jsx";
function HomePage() {
    return (
       
            <>
            <HeroSection/>
            <Companies/>
            <ProcessSection/>
            <WhyChooseSection />
            <Features/>
            <Services/>
            <FeatureSection/>
            <Vector/>   
            <SuccessStories/>
            <Dream/>

            </>

    );
}

export default HomePage;
