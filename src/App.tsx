import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { Diagnostico } from '@/components/sections/diagnostico/Diagnostico';
import { Historia } from '@/components/sections/Historia';
import { Sistema } from '@/components/sections/Sistema';
import { ComoArrancas } from '@/components/sections/ComoArrancas';
import { Precio } from '@/components/sections/Precio';
import { Faq } from '@/components/sections/Faq';

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Diagnostico />
        <Historia />
        <Sistema />
        <ComoArrancas />
        <Precio />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default App;
