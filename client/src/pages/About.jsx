import React from "react";
import ProfileHero from "../components/sections/ProfileHero.jsx";
import OurStory from "../components/sections/OurStory.jsx";
import SuccessByNumbers from "../components/sections/SuccessByNumbers.jsx";
import OurTeam from "../components/sections/OurTeam.jsx";
import Review from "../components/sections/Review.jsx";

function AboutPage() {
  return (
    <>
      <ProfileHero />
      <OurStory />
      <SuccessByNumbers />
      <OurTeam />
      <Review />
    </>
  );
}

export default AboutPage;