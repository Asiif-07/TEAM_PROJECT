import React from "react";
import ProfileHero from "../components/ui/ProfileHero.jsx";
import OurStory from "../components/ui/OurStory.jsx";
import SuccessByNumbers from "../components/ui/SuccessByNumbers.jsx";
import OurTeam from "../components/ui/OurTeam.jsx";
import Review from "../components/ui/Review.jsx";

function AboutPage() {
  return (
    <>
      <ProfileHero />
      <OurStory />
      <SuccessByNumbers />
      <OurTeam />
      <Review/>
    </>
  );
}

export default AboutPage;