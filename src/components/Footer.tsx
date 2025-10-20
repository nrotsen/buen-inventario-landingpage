import {
  Package,
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageSquare,
  Heart,
} from "lucide-react";
import { scrollToSection } from "@/lib/utils";

export const Footer = () => {
  // Helper function to create WhatsApp link
  const createWhatsAppLink = (phoneNumber: string, message?: string) => {
    const cleanPhone = phoneNumber.replace(/\s+/g, "").replace(/-/g, "");
    const encodedMessage = message ? encodeURIComponent(message) : "";
    return `https://wa.me/${cleanPhone}${
      encodedMessage ? `?text=${encodedMessage}` : ""
    }`;
  };

  const quickLinks = [
    { label: "Inicio", id: "hero" },
    { label: "Características", id: "features" },
    { label: "Beneficios", id: "benefits" },
    { label: "Contacto", id: "contact" },
  ];

  const solutions = [
    "Gestión de Inventario",
    "Tienda Online",
    "Punto de Venta",
    "Analytics y Reportes",
    "App Móvil",
    "Facturación Electrónica",
  ];

  const support = [
    "Centro de Ayuda",
    "Documentación API",
    "Videos Tutoriales",
    "Webinars",
    "Soporte Técnico",
    "Migración de Datos",
  ];

  const legal = [
    "Términos de Servicio",
    "Política de Privacidad",
    "Política de Cookies",
    "SLA",
    "GDPR",
    "Facturación",
  ];

  const socialLinks = [
    {
      icon: MessageSquare,
      href: createWhatsAppLink(
        "+54 9 11 2277-5850",
        "¡Hola! Me interesa conocer más sobre Buen Inventario."
      ),
      label: "WhatsApp",
    },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Package className="h-8 w-8 text-primary-400" />
                <Zap className="h-4 w-4 text-accent-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-2xl font-bold font-heading">
                Buen Inventario
              </span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              La plataforma todo-en-uno que transforma la gestión de inventario
              de las PYMES. Desde control de stock hasta tu propia tienda
              online, todo en un solo lugar.
            </p>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Buenos Aires, Argentina</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a
                  href={createWhatsAppLink(
                    "+54 9 11 2277-5850",
                    "¡Hola! Me interesa conocer más sobre Buen Inventario."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  +54 9 11 2277-5850
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:hola@bueninventario.com?subject=Consulta sobre Buen Inventario&body=Hola, me interesa conocer más sobre Buen Inventario. ¿Podrían contactarme?"
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                >
                  hola@bueninventario.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">
              Navegación
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">
              Soluciones
            </h3>
            <ul className="space-y-3">
              {solutions.map((solution, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {solution}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-heading">Soporte</h3>
            <ul className="space-y-3">
              {support.map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        {/* <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold mb-4 font-heading">
                Mantente actualizado
              </h3>
              <p className="text-gray-300 mb-6 lg:mb-0">
                Recibe tips, actualizaciones de producto y casos de éxito
                directamente en tu email.
              </p>
            </div>
            <div className="lg:w-1/2 lg:pl-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-lg font-medium hover:from-primary-700 hover:to-accent-600 transition-all duration-300 whitespace-nowrap">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
         </div> */}
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-6">
              <p className="text-gray-400 text-sm">
                © 2024 Buen Inventario. Todos los derechos reservados.
              </p>
              <div className="flex flex-wrap gap-6">
                {legal.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm flex items-center">
                Hecho con <Heart className="h-4 w-4 text-red-500 mx-1" /> en
                Argentina
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
