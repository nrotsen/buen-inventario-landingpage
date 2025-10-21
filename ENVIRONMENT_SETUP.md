# 🔧 Configuración de Variables de Entorno

## 📋 Variables Requeridas

Para que el formulario de contacto funcione correctamente, necesitas configurar las siguientes variables de entorno:

### 📧 EmailJS Configuration

1. **VITE_EMAILJS_SERVICE_ID**

   - Obtén este valor desde: https://dashboard.emailjs.com/admin
   - Ejemplo: `service_abc123`

2. **VITE_EMAILJS_TEMPLATE_ID**

   - Obtén este valor desde: https://dashboard.emailjs.com/admin/templates
   - Ejemplo: `template_xyz789`

3. **VITE_EMAILJS_PUBLIC_KEY**
   - Obtén este valor desde: https://dashboard.emailjs.com/admin/account
   - Ejemplo: `user_def456`
   - ⚠️ **NOTA**: Esta es la clave pública, es seguro exponerla en el frontend

### 🔒 Google reCAPTCHA v3

4. **VITE_RECAPTCHA_SITE_KEY**
   - Obtén este valor desde: https://www.google.com/recaptcha/admin
   - Ejemplo: `6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - ⚠️ **NOTA**: Esta es la clave del sitio, es seguro exponerla en el frontend

## 🚀 Configuración en Vercel

### Paso 1: Acceder a la configuración

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**

### Paso 2: Agregar las variables

Para cada variable, agrega:

- **Name**: El nombre exacto (ej: `VITE_EMAILJS_SERVICE_ID`)
- **Value**: El valor correspondiente
- **Environment**: Selecciona `Production`, `Preview`, y `Development`

### Paso 3: Warnings de seguridad

Vercel mostrará warnings para variables con prefijo `VITE_` que contienen `KEY`:

- ✅ **VITE_EMAILJS_PUBLIC_KEY**: Es seguro, es la clave pública
- ✅ **VITE_RECAPTCHA_SITE_KEY**: Es seguro, es la clave del sitio

Estos warnings son normales para claves públicas que deben ser accesibles en el frontend.

## 🔧 Configuración Local

Para desarrollo local, crea un archivo `.env` en la raíz del proyecto:

```env
VITE_EMAILJS_SERVICE_ID=tu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=tu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=tu_public_key_aqui
VITE_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key_aqui
```

## 📝 Template de EmailJS

Asegúrate de que tu template en EmailJS contenga las siguientes variables:

```
Nombre: {{name}}
Email: {{email}}
Empresa: {{company}}
Teléfono: {{phone}}
Mensaje: {{message}}
```

## ✅ Verificación

Después de configurar las variables:

1. Redeploy tu aplicación en Vercel
2. Prueba el formulario de contacto
3. Verifica que no aparezcan errores 400 en la consola

## 🆘 Troubleshooting

### Error: "The template ID not found"

- ✅ Verifica que `VITE_EMAILJS_TEMPLATE_ID` esté correctamente configurado
- ✅ Asegúrate de que el template exista en tu dashboard de EmailJS

### Error: "The service ID not found"

- ✅ Verifica que `VITE_EMAILJS_SERVICE_ID` esté correctamente configurado
- ✅ Asegúrate de que el servicio esté activo en EmailJS

### reCAPTCHA no funciona

- ✅ Verifica que `VITE_RECAPTCHA_SITE_KEY` esté correctamente configurado
- ✅ Asegúrate de que el dominio esté autorizado en Google reCAPTCHA
