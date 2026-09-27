# JRG estudio — Portfolio Web

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5"/>
  <img src="https://img.shields.io/badge/CSS-Vanilla-1572B6?style=flat-square&logo=css3&logoColor=white" alt="Vanilla CSS"/>
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP"/>
  <img src="https://img.shields.io/badge/i18n-ES%20%7C%20EN%20%7C%20EU-orange?style=flat-square" alt="Multilingual"/>
</div>

<br/>

> Portfolio personal de **Jakes Rodriguez Garcia** — Desarrollador web freelance especializado en diseño premium para negocios locales del País Vasco.

---

## ✨ Características

- 🌊 **Dynamic Island** — Navegación flotante estilo iOS con animaciones spring líquido (`cubic-bezier`) y micro-interacciones premium
- 🌐 **Multilingüe** — Interfaz completa en Español, Inglés y Euskera con cambio dinámico al vuelo
- 🎨 **Liquid Glass Design** — Glassmorphism, backdrop-blur, gradientes suaves y sombras en capas
- 📱 **Responsive** — Adaptado para móvil, tablet y escritorio con layouts fluid
- ⚡ **Animaciones GSAP + CSS** — Transiciones suaves, parallax y staggered entrances
- 🗺️ **Google Business / Maps** — Sección de reputación con integración visual de Google
- 📧 **EmailJS** — Formulario de contacto funcional con envío real al email del propietario
- 💬 **WhatsApp Float** — Botón flotante de contacto directo por WhatsApp
- 🔍 **SEO Dinámico** — Metadatos Open Graph, Twitter Cards y JSON-LD actualizados en tiempo real por idioma
- 🗺️ **Sitemap XML** — Configurado para indexación multilingüe en Google Search Console

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 18** | Framework UI principal |
| **Vite 5** | Bundler y dev server |
| **Vanilla CSS** | Sistema de diseño completo y tokens visuales |
| **GSAP 3** | Animaciones avanzadas (Spline 3D, scroll) |
| **Lucide React** | Iconografía ligera y consistente |
| **EmailJS** | Envío de formularios de contacto |

---

## 🚀 Instalación y Desarrollo

```bash
# 1. Clonar el repositorio
git clone https://github.com/jakesroodriguez/JRG-estudio.git
cd JRG-estudio

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

El servidor arranca en **http://localhost:5173** por defecto con Hot Module Replacement (HMR) activo.

```bash
# Compilar para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

---

## 📁 Estructura del Proyecto

```
JakesRodriguez/
├── public/
│   ├── sitemap.xml          # Sitemap multilingüe para SEO
│   ├── favicon.png          # Icono de la marca JRG
│   └── portfolio-*.webp     # Imágenes de proyectos del portfolio
├── src/
│   ├── App.jsx              # Componente principal (SPA completa)
│   └── components/
│       └── CardFanCarousel.jsx  # Carrusel de tarjetas en abanico
├── index.css                # Sistema de diseño completo (5500+ líneas)
├── index.html               # Entry point con SEO, JSON-LD y scripts
├── package.json
└── vite.config.js
```

---

## 🎨 Sistema de Diseño

La paleta de marca está definida como tokens CSS en `:root`:

```css
--navy:       #212529;   /* Gris oscuro principal */
--navy-dark:  #14171A;   /* Versión oscura para hover/sombras */
--ash:        #E1E8ED;   /* Gris claro para fondos secundarios */
--white:      #FFFFFF;
--text:       #2C3E50;

/* Curvas de animación premium */
--ease-spring:  cubic-bezier(0.22, 1, 0.36, 1);
--spring-liquid: cubic-bezier(0.3, 1.45, 0.35, 1);  /* Rebote líquido */
```

---

## 🌐 Proyectos en el Portfolio

| Proyecto | Descripción | Tech |
|---|---|---|
| [Gure Trena](https://guretrenaurretxu.com/) | Bar tradicional en Urretxu | React, Vite, Tailwind |
| [Urkulu Móviles](https://urkulumovilesurretxu.com/) | Tienda reparación móviles | React, Vite, Tailwind |
| [Otxaran Denda](https://otxaran-denda.vercel.app/) | Tienda de ropa de mujer | HTML5, Tailwind, JS |

---

## 📬 Contacto

- 🌐 Web: [jrgestudio.com](https://jrgestudio.com)
- 📱 WhatsApp: [+34 613 448 185](https://wa.me/34613448185)
- 📧 Email: via formulario web

---

## 📄 Licencia

© 2026 Jakes Rodriguez Garcia / JRG estudio — Todos los derechos reservados.
