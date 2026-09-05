import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { Historia } from '@/components/sections/Historia';
import { Diagnostico } from '@/components/sections/diagnostico/Diagnostico';
import { Sistema } from '@/components/sections/Sistema';
import { Precio } from '@/components/sections/Precio';
import { Faq } from '@/components/sections/Faq';

function App() {
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
