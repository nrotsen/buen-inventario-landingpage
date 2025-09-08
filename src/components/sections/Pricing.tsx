import { useState } from "react";
import { Check, X, Crown, Zap, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = [
    {
      name: "Starter",
      description: "Perfecto para emprendedores",
      monthlyPrice: 99,
      yearlyPrice: 990, // 2 meses gratis
      icon: Zap,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Hasta 1,000 productos",
        "1 usuario",
        "Tienda online básica",
        "Reportes básicos",
        "Soporte por email",
        "App móvil",
        "Códigos de barras",
      ],
      limitations: [
        "Sin usuarios adicionales",
        "Reportes limitados",
        "Sin integración WhatsApp",
      ],
      popular: false,
    },
    {
      name: "Professional",
      description: "Ideal para PYMES en crecimiento",
      monthlyPrice: 199,
      yearlyPrice: 1990, // 2 meses gratis
      icon: Crown,
      color: "from-purple-500 to-pink-500",
      features: [
        "Productos ilimitados",
        "5 usuarios incluidos",
        "Tienda online completa",
        "Analytics avanzados",
        "Soporte prioritario",
        "App móvil premium",
        "Integración WhatsApp",
        "Multi-sucursal",
        "Facturación electrónica",
        "Reportes personalizados",
        "Backup automático",
      ],
      limitations: [],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Para empresas grandes",
      monthlyPrice: 399,
      yearlyPrice: 3990, // 2 meses gratis
      icon: Star,
      color: "from-orange-500 to-red-500",
      features: [
        "Todo lo de Professional",
        "Usuarios ilimitados",
        "Sucursales ilimitadas",
        "API personalizada",
        "Gerente de cuenta dedicado",
        "Capacitación personalizada",
        "Integración ERP",
        "Reportes ejecutivos",
        "SLA garantizado",
        "Migración gratuita",
        "Personalización avanzada",
      ],
      limitations: [],
      popular: false,
    },
  ];

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlyCost = monthly * 12;
    const savings = yearlyCost - yearly;
    const percentage = Math.round((savings / yearlyCost) * 100);
    return { savings, percentage };
  };

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
            Planes que se adaptan
            <span className="gradient-text block">a tu crecimiento</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sin costos ocultos, sin sorpresas. Comienza gratis y escala cuando
            lo necesites.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-xl p-1 shadow-md">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingCycle === "yearly"
                  ? "bg-primary-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                2 meses gratis
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-2 border-primary-500 shadow-xl scale-105"
                  : "border border-gray-200 hover:border-primary-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white text-center py-2 text-sm font-semibold">
                    🔥 Más Popular
                  </div>
                </div>
              )}

              <CardHeader className={plan.popular ? "pt-12" : "pt-6"}>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}
                >
                  <plan.icon className="h-7 w-7 text-white" />
                </div>

                <CardTitle className="text-2xl font-bold font-heading">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600">{plan.description}</p>

                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">
                      $
                      {billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : Math.round(plan.yearlyPrice / 12)}
                    </span>
                    <span className="text-gray-600">USD/mes</span>
                  </div>

                  {billingCycle === "yearly" && (
                    <div className="text-sm text-green-600 font-medium">
                      Ahorras $
                      {
                        calculateSavings(plan.monthlyPrice, plan.yearlyPrice)
                          .savings
                      }{" "}
                      USD/año (
                      {
                        calculateSavings(plan.monthlyPrice, plan.yearlyPrice)
                          .percentage
                      }
                      % descuento)
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.map((limitation, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 opacity-60"
                    >
                      <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500 line-through">
                        {limitation}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {plan.name === "Enterprise"
                    ? "Contactar ventas"
                    : "Comenzar prueba gratuita"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 font-heading">
            Preguntas frecuentes
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo cambiar de plan en cualquier momento?
                </h4>
                <p className="text-gray-600 text-sm">
                  Sí, puedes actualizar o degradar tu plan cuando quieras. Los
                  cambios se aplican de inmediato.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Qué incluye la prueba gratuita?
                </h4>
                <p className="text-gray-600 text-sm">
                  30 días completos con todas las funciones del plan
                  Professional, sin restricciones.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Hay costos de configuración?
                </h4>
                <p className="text-gray-600 text-sm">
                  No, la configuración es completamente gratuita. Nuestro equipo
                  te ayuda sin costo adicional.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Cómo funciona el soporte técnico?
                </h4>
                <p className="text-gray-600 text-sm">
                  Soporte 24/7 vía WhatsApp, email y videollamada. Respuesta
                  garantizada en menos de 2 horas.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo cancelar en cualquier momento?
                </h4>
                <p className="text-gray-600 text-sm">
                  Sí, sin penalizaciones ni compromisos. Tu data permanece
                  segura por 90 días después de cancelar.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  ¿Ofrecen descuentos para ONGs?
                </h4>
                <p className="text-gray-600 text-sm">
                  Sí, tenemos descuentos especiales para organizaciones sin
                  fines de lucro y educativas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-6 py-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-5 w-5 text-white" />
            </div>
            <span className="text-green-800 font-medium">
              Garantía de devolución de dinero por 30 días
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
