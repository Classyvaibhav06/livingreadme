import PageEntrance from "./components/PageEntrance";
import LandingNavigation from "./components/LandingNavigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <PageEntrance>
      <LandingNavigation />
      <Hero />
      <Features />
      <Faq />
      <Footer />
    </PageEntrance>
  );
}
