import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950">
      <Navigation />
      <Hero />
      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-24">
        <Features />
        <HowItWorks />
        <CTA />
      </div>
      <Footer />
    </div>
  );
}
