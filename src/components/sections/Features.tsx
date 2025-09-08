import {
  Package,
  Globe,
  BarChart3,
  Smartphone,
  Shield,
  Zap,
  Users,
  CreditCard,
  Bell,
  RefreshCw,
  TrendingUp,
  Store,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export const Features = () => {
  const features = [
    {
      icon: Package,
      title: "Gestión Inteligente de Inventario",
      description:
        "Control total de tus productos con alertas automáticas de stock bajo, seguimiento en tiempo real y categorización avanzada.",
      color: "text-blue-600",
    },
    {
      icon: Globe,
      title: "Tienda Online Automática",
      description:
        "Crea tu e-commerce en minutos. Cada producto que añadas se publica automáticamente en tu tienda web personalizada.",
      color: "text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reportes",
      description:
        "Dashboards intuitivos con métricas clave, análisis de ventas y predicciones de demanda basadas en IA.",
      color: "text-green-600",
    },
    {
      icon: Smartphone,
      title: "App Móvil Nativa",
      description:
        "Gestiona tu inventario desde cualquier lugar con nuestra app móvil. Escanea códigos de barras y actualiza stock al instante.",
      color: "text-orange-600",
    },
    {
      icon: CreditCard,
      title: "Pagos Integrados",
      description:
        "Acepta pagos con tarjeta, transferencias y efectivo. Integración completa con Mercado Pago y otros procesadores.",
      color: "text-emerald-600",
    },
    {
      icon: Users,
      title: "Multi-usuario",
      description:
        "Colabora con tu equipo. Asigna roles y permisos específicos para empleados, managers y administradores.",
      color: "text-indigo-600",
    },
    {
      icon: Bell,
      title: "Notificaciones Inteligentes",
      description:
        "Recibe alertas por WhatsApp, email o SMS sobre stock bajo, nuevos pedidos y métricas importantes.",
      color: "text-red-600",
    },
    {
      icon: RefreshCw,
      title: "Sincronización en Tiempo Real",
      description:
        "Todos tus dispositivos siempre actualizados. Cambios instantáneos entre la app, web y punto de venta.",
      color: "text-cyan-600",
    },
    {
      icon: Shield,
      title: "Seguridad Empresarial",
      description:
        "Encriptación de datos, backups automáticos y cumplimiento con estándares internacionales de seguridad.",
      color: "text-gray-600",
    },
  ];

  const mainFeatures = [
    {
      icon: Store,
      title: "Todo-en-Uno",
      description:
        "Inventario, ventas, e-commerce y analytics en una sola plataforma.",
      stats: "15+ herramientas integradas",
    },
    {
      icon: Zap,
      title: "Súper Rápido",
      description:
        "Configuración en menos de 5 minutos. Tu tienda online lista al instante.",
      stats: "5 min setup",
    },
    {
      icon: TrendingUp,
      title: "Resultados Comprobados",
      description:
        "Nuestros clientes aumentan sus ventas un 300% en promedio en 6 meses.",
      stats: "300% ROI promedio",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
            Todo lo que necesitas para
            <span className="gradient-text block">hacer crecer tu negocio</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma completa que se adapta a tu negocio, no al revés.
            Desde gestión de inventario hasta tu propia tienda online.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card
              key={index}
              className="text-center border-2 hover:border-primary-200 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center`}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-3">
                  <span className="text-primary-600 font-bold text-lg">
                    {feature.stats}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* All Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card group hover:scale-105">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-heading">
              ¿Listo para transformar tu negocio?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Únete a más de 500 empresas que ya digitalizaron su inventario
            </p>
            <button
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Comenzar mi prueba gratuita
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
