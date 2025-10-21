import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
  Calendar,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Helper function to create WhatsApp link
  const createWhatsAppLink = (phoneNumber: string, message?: string) => {
    const cleanPhone = phoneNumber.replace(/\s+/g, "").replace(/-/g, "");
    const encodedMessage = message ? encodeURIComponent(message) : "";
    return `https://wa.me/${cleanPhone}${
      encodedMessage ? `?text=${encodedMessage}` : ""
    }`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      console.error("ReCAPTCHA no está disponible todavía.");
      alert("Error al cargar reCAPTCHA. Intenta nuevamente.");
      return;
    }

    setIsSending(true);

    try {
      // Ejecutar reCAPTCHA
      const token = await executeRecaptcha("contact_form");

      // Enviar email con EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID!,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          message: formData.message,
          "g-recaptcha-response": token,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY!
      );

      console.log("✅ Email enviado correctamente.");
      setIsSubmitted(true);
    } catch (error) {
      console.error("❌ Error al enviar el mensaje:", error);
      alert("Ocurrió un error al enviar el mensaje. Intenta nuevamente.");
    } finally {
      setIsSending(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactMethodClick = (method: (typeof contactMethods)[0]) => {
    switch (method.title) {
      case "WhatsApp": {
        const whatsappMessage =
          "¡Hola! Me interesa conocer más sobre Buen Inventario. ¿Podrían darme más información?";
        const whatsappLink = createWhatsAppLink(
          method.contact,
          whatsappMessage
        );
        window.open(whatsappLink, "_blank");
        break;
      }
      case "Email": {
        window.open(
          `mailto:${method.contact}?subject=Consulta sobre Buen Inventario&body=Hola, me interesa conocer más sobre Buen Inventario. ¿Podrían contactarme?`,
          "_blank"
        );
        break;
      }
      case "Videollamada": {
        alert(
          "Para agendar una demo personalizada, por favor contáctanos por WhatsApp o email."
        );
        break;
      }
      default:
        break;
    }
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Respuesta inmediata",
      contact: "+54 9 11 2277-5850",
      action: "Chatear ahora",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Respuesta en 2 horas",
      contact: "hola@bueninventario.com",
      action: "Enviar email",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Videollamada",
      description: "Demo personalizada",
      contact: "30 min gratis",
      action: "Agendar demo",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Setup en 5 minutos",
      description: "Tu cuenta lista para usar al instante",
    },
    {
      icon: Users,
      title: "Onboarding gratuito",
      description: "Te acompañamos en los primeros pasos",
    },
    {
      icon: Zap,
      title: "Migración sin costo",
      description: "Transferimos tus datos actuales gratis",
    },
  ];

  if (isSubmitted) {
    return (
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-primary-600 to-accent-500"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-heading">
              ¡Gracias por tu interés!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Hemos recibido tu mensaje. Nuestro equipo se pondrá en contacto
              contigo en las próximas 2 horas.
            </p>
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4">
              <p className="text-primary-700 font-medium">
                💡 Mientras tanto, puedes comenzar tu prueba gratuita de 30 días
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-primary-600 to-accent-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Habla con nuestro equipo y descubre cómo Buen Inventario puede
            transformar tu negocio. Demo gratuita en 15 minutos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                Comienza tu prueba gratuita
              </CardTitle>
              <p className="text-gray-600">
                Completa el formulario y accede inmediatamente a todas las
                funciones por 30 días.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuéntanos sobre tu negocio
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="¿Cuántos productos manejas? ¿Qué sistema usas actualmente? ¿Cuáles son tus principales desafíos?"
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSending}
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-500"
                >
                  {isSending ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Comenzar prueba gratuita ahora
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar este formulario, aceptas nuestros términos y
                  condiciones. No compartimos tu información con terceros.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Methods & Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">
                Otras formas de contacto
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm border-0 hover:bg-white transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center`}
                        >
                          <method.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {method.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {method.description}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {method.contact}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactMethodClick(method)}
                        >
                          {method.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">
                Lo que incluye tu prueba gratuita
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 text-white"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-white/80 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <Card className="bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Información de contacto
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Buenos Aires, Argentina
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      +54 9 11 2277 5850
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      hola@bueninventario.com
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
