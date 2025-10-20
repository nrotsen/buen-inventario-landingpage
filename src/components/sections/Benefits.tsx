import {
  Clock,
  DollarSign,
  TrendingUp,
  Shield,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Ahorra 20+ horas semanales",
      description:
        "Automatiza tareas repetitivas y dedica más tiempo a hacer crecer tu negocio.",
      metrics: [
        "Gestión automática de stock",
        "Reportes instantáneos",
        "Sincronización en tiempo real",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: DollarSign,
      title: "Aumenta tus ventas hasta 300%",
      description:
        "Con tu tienda online automática y herramientas de marketing integradas.",
      metrics: [
        "E-commerce automático",
        "SEO optimizado",
        "Marketing integrado",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Reduce costos operativos 45%",
      description:
        "Elimina errores manuales, optimiza inventario y mejora la eficiencia.",
      metrics: [
        "Menos desperdicio",
        "Control de costos",
        "Optimización de compras",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Seguridad y confiabilidad 99.9%",
      description:
        "Tus datos seguros con backups automáticos y encriptación empresarial.",
      metrics: ["Backups diarios", "Encriptación SSL", "Soporte 24/7"],
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "María González",
      company: "Boutique Luna",
      image: "👩‍💼",
      rating: 5,
      comment:
        "En 3 meses aumenté mis ventas 250%. La tienda online se creó sola y mis clientes pueden comprar 24/7.",
    },
    {
      name: "Carlos Rodríguez",
      company: "TechStore Pro",
      image: "👨‍💻",
      rating: 5,
      comment:
        "Antes perdía 15 horas semanales en Excel. Ahora todo es automático y puedo enfocarme en crecer el negocio.",
    },
    {
      name: "Ana López",
      company: "Farmacia Central",
      image: "👩‍⚕️",
      rating: 5,
      comment:
        "El control de vencimientos y alertas automáticas me ahorraron miles de pesos en productos vencidos.",
    },
  ];

  const comparisonData = [
    {
      aspect: "Configuración",
      traditional: "Semanas de implementación",
      buenInventario: "5 minutos setup",
      icon: Clock,
    },
    {
      aspect: "Costo mensual",
      traditional: "$500+ por herramienta",
      buenInventario: "Todo incluido, precio accesible",
      icon: DollarSign,
    },
    {
      aspect: "Soporte técnico",
      traditional: "Horarios limitados",
      buenInventario: "24/7 vía WhatsApp",
      icon: Users,
    },
    {
      aspect: "Actualizaciones",
      traditional: "Costos adicionales",
      buenInventario: "Gratis de por vida",
      icon: Zap,
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
            Resultados reales,
            <span className="gradient-text block">impacto inmediato</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Más de 500 empresas ya transformaron su forma de trabajar. Estos son
            los beneficios que experimentan desde el primer día.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${benefit.color}`}
              ></div>
              <CardHeader className="pb-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center mb-4`}
                >
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 font-heading">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.metrics.map((metric, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{metric}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 mb-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 font-heading">
            ¿Por qué elegir Buen Inventario?
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Aspecto
                  </th>
                  <th className="text-center p-4 font-semibold text-gray-600">
                    Soluciones Tradicionales
                  </th>
                  <th className="text-center p-4 font-semibold text-primary-600">
                    Buen Inventario
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-white/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <row.icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">
                          {row.aspect}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-600">
                      {row.traditional}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-primary-600">
                          {row.buenInventario}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 font-heading">
            Lo que dicen nuestros clientes
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="text-4xl mb-4">{testimonial.image}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-gray-600">{testimonial.company}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary-600 to-accent-500 border-0 text-white max-w-4xl mx-auto">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
                Únete a la revolución digital
              </h3>
              <p className="text-lg mb-6 opacity-90">
                500+ empresas ya transformaron su inventario. Es tu turno.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-gray-100"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Comenzar gratis ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Agendar demo personalizada
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
