import { ArrowRight, Play, Star, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import { scrollToSection } from "@/lib/utils";

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-2xl animate-bounce-in"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-400/10 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Award className="h-4 w-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">
              Gestión de Inventarios para PYMES
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up font-heading">
            Transforma tu
            <span className="block gradient-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              Inventario Digital
            </span>
            en minutos
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            La plataforma todo-en-uno que necesitas para gestionar tu
            inventario, crear tu tienda online y hacer crecer tu negocio sin
            complicaciones.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-10 animate-slide-in-right">
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-5 w-5 text-accent-300" />
              <span className="font-semibold">500+ Empresas</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">4.9/5 Estrellas</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span className="font-semibold">Incrementa tu ROI Promedio</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              variant="default"
              size="xl"
              className="bg-white text-primary-600 hover:bg-gray-100 shadow-2xl"
              onClick={() => scrollToSection("contact")}
            >
              Comenzar Gratis Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white text-white hover:bg-white/10 backdrop-blur-sm"
              onClick={() => scrollToSection("features")}
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 animate-fade-in">
            <p className="text-white/70 text-sm mb-4">
              Confiado por empresas líderes
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-white font-semibold">TechCorp</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-white font-semibold">InnovaStore</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-white font-semibold">MegaRetail</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <span className="text-white font-semibold">SmartBiz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};
