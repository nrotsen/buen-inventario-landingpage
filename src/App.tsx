import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { Historia } from '@/components/sections/Historia';
import { Diagnostico } from '@/components/sections/Diagnostico';
import { Sistema } from '@/components/sections/Sistema';
import { Precio } from '@/components/sections/Precio';
import { Faq } from '@/components/sections/Faq';

function App() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const targets = document.querySelectorAll('section.reveal-on-scroll');
    targets.forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <Historia />
        <Diagnostico />
        <Sistema />
        <Precio />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default App;
