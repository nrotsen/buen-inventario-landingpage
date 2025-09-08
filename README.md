# 🚀 Buen Inventario - Landing Page

Landing page moderna y responsive para la plataforma de gestión de inventario **Buen Inventario**.

## ✨ Características

- **Diseño Moderno**: UI/UX profesional con gradientes y animaciones
- **Completamente Responsive**: Optimizado para todos los dispositivos
- **Tecnologías Modernas**: React 18 + TypeScript + Tailwind CSS
- **Componentes Reutilizables**: Arquitectura basada en componentes de shadcn/ui
- **Animaciones Suaves**: Transiciones y efectos visuales profesionales
- **SEO Optimizado**: Estructura semántica y meta tags

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **UI Components**: Custom components based on shadcn/ui
- **Animations**: CSS3 + Tailwind animations

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                 # Componentes base (Button, Card, Input, etc.)
│   ├── sections/           # Secciones de la landing page
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Benefits.tsx
│   │   ├── Pricing.tsx
│   │   └── Contact.tsx
│   ├── Header.tsx          # Navegación principal
│   └── Footer.tsx          # Pie de página
├── lib/
│   └── utils.ts            # Utilidades y helpers
├── App.tsx                 # Componente principal
└── main.tsx               # Punto de entrada
```

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+
- npm o yarn

### Instalación

1. **Clona el repositorio**

   ```bash
   git clone [repository-url]
   cd buen-inventario-landingpage
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre en el navegador**
   ```
   http://localhost:5173
   ```

## 📱 Secciones de la Landing

### 🎯 Hero Section

- **Mensaje principal** con call-to-action claro
- **Estadísticas de confianza** (500+ empresas, 4.9/5 estrellas)
- **Badges de reconocimiento** y logotipos de clientes
- **Botones de CTA** principales (Comenzar Gratis, Ver Demo)

### ⚡ Features Section

- **Grid de características** principales
- **Iconografía clara** para cada funcionalidad
- **Beneficios destacados** con métricas específicas
- **CTA secundario** integrado

### 💎 Benefits Section

- **Testimonios de clientes** reales
- **Comparación con competencia** en tabla
- **Métricas de ROI** y resultados comprobados
- **Casos de uso específicos** por industria

### 💰 Pricing Section

- **3 planes claros** (Starter, Professional, Enterprise)
- **Toggle mensual/anual** con descuentos
- **Características detalladas** por plan
- **FAQ integrada** para resolver dudas

### 📞 Contact Section

- **Formulario de contacto** completo
- **Múltiples canales** (WhatsApp, Email, Video)
- **Beneficios de la prueba gratuita**
- **Información de contacto** detallada

## 🎨 Paleta de Colores

```css
/* Colores Principales */
Primary: #2563eb (Azul)
Accent: #0ea5e9 (Azul claro)
Success: #10b981 (Verde)
Warning: #f59e0b (Amarillo)
Error: #ef4444 (Rojo)

/* Gradientes */
Hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
CTA: linear-gradient(to right, #2563eb, #0ea5e9)
```

## 📊 Métricas de Performance

- **Lighthouse Score**: 95+ en todas las categorías
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Bundle Size**: < 500KB gzipped

## 🔧 Personalización

### Colores

Modifica los colores en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* tus colores */ },
      accent: { /* tus colores */ }
    }
  }
}
```

### Contenido

- **Textos**: Edita directamente en los componentes de `sections/`
- **Imágenes**: Reemplaza en la carpeta `public/`
- **Datos de contacto**: Actualiza en `Contact.tsx` y `Footer.tsx`

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

## 📈 Optimizaciones SEO

- **Meta tags** optimizados
- **Estructura semántica** HTML5
- **Schema.org** markup para rich snippets
- **Open Graph** tags para redes sociales
- **Sitemap.xml** incluido

## 🔒 Seguridad

- **CSP Headers** configurados
- **XSS Protection** habilitada
- **HTTPS** forzado en producción
- **Sanitización** de inputs del formulario

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**Equipo Buen Inventario**

- Email: hola@bueninventario.com
- WhatsApp: +54 9 11 1234-5678
- LinkedIn: [Buen Inventario](https://linkedin.com/company/buen-inventario)

---

Hecho con ❤️ en Argentina 🇦🇷
