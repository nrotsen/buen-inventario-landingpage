import { useState, useEffect } from "react";
import { Menu, X, Package, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { scrollToSection } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Inicio", id: "hero" },
    { label: "Características", id: "features" },
    { label: "Beneficios", id: "benefits" },
    { label: "Contacto", id: "contact" },
  ];

  const handleMenuClick = (id: string) => {
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="relative">
              <Package
                className={`h-8 w-8 transition-colors ${
                  isScrolled ? "text-primary-600" : "text-white"
                }`}
              />
              <Zap
                className={`h-4 w-4 absolute -top-1 -right-1 transition-colors ${
                  isScrolled ? "text-accent-500" : "text-primary-300"
                }`}
              />
            </div>
            <span
              className={`text-xl font-bold font-heading transition-colors ${
                isScrolled ? "gradient-text" : "text-white"
              }`}
            >
              Buen Inventario
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`font-medium transition-colors hover:text-primary-600 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="gradient"
              size="default"
              onClick={() => scrollToSection("contact")}
            >
              Comenzar Gratis
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200/50 rounded-b-lg shadow-lg">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <Button
                  variant="gradient"
                  size="default"
                  className="w-full"
                  onClick={() => handleMenuClick("contact")}
                >
                  Comenzar Gratis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
