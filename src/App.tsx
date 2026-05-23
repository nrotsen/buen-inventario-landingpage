import { useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/sections/Hero";
import { Features } from "./components/sections/Features";
import { Benefits } from "./components/sections/Benefits";
import { Pricing } from "./components/sections/Pricing";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/Footer";

function App() {
  useEffect(() => {
    // Smooth scrolling for the entire document
    document.documentElement.style.scrollBehavior = "smooth";

    // Add intersection observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
