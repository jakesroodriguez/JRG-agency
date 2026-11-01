export type LegalLang = "es" | "eu" | "en";

export interface LegalContent {
  nav: {
    back: string;
    print: string;
    cookieSettings: string;
    privacyAssistant: string;
    notice: string;
    privacy: string;
    cookies: string;
    terms: string;
    a11y: string;
  };
  cookies: {
    title: string;
    desc: string;
    moreInfo: string;
    configure: string;
    reject: string;
    accept: string;
    modalTitle: string;
    modalSubtitle: string;
    technical: string;
    technicalDesc: string;
    analytics: string;
    analyticsDesc: string;
    preferences: string;
    preferencesDesc: string;
    active: string;
    optional: string;
    downloadProof: string;
    save: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    disclaimer: string;
    placeholder: string;
    send: string;
    suggestionsTitle: string;
    suggestions: {
      label: string;
      prompt: string;
    }[];
    eraseRequestTitle: string;
    eraseRequestAction: string;
  };
}

export const legalTranslations: Record<LegalLang, LegalContent> = {
  es: {
    nav: {
      back: "← Volver al inicio",
      print: "Imprimir",
      cookieSettings: "Ajustes de cookies",
      privacyAssistant: "Asistente Legal IA",
      notice: "Aviso Legal",
      privacy: "Privacidad",
      cookies: "Cookies",
      terms: "Términos",
      a11y: "Accesibilidad",
    },
    cookies: {
      title: "Privacidad y cookies",
      desc: "Usamos cookies técnicas para el funcionamiento de la web y analíticas anónimas para medir rendimiento.",
      moreInfo: "Más información",
      configure: "Configurar",
      reject: "Rechazar",
      accept: "Aceptar",
      modalTitle: "Preferencias de privacidad",
      modalSubtitle: "Elige qué datos consientes procesar en este dispositivo.",
      technical: "Técnicas y seguridad",
      technicalDesc: "Necesarias para la navegación básica y recordar tu elección de privacidad.",
      analytics: "Analíticas y rendimiento",
      analyticsDesc: "Métricas anónimas para evaluar velocidad y estabilidad de la web (Vercel).",
      preferences: "Preferencias",
      preferencesDesc: "Recuerdan tu idioma seleccionado y ajustes de vista para próximas visitas.",
      active: "Activas",
      optional: "Opcional",
      downloadProof: "Descargar recibo de consentimiento (.json)",
      save: "Guardar selección",
    },
    assistant: {
      title: "Asistente de Privacidad & Derechos",
      subtitle: "Consulta dudas legales o ejerce tus derechos RGPD en segundos.",
      disclaimer: "Impulsado por Gemini 3.8 Flash. No sustituye asesoramiento legal formal.",
      placeholder: "Pregunta sobre tus datos o solicita un borrado...",
      send: "Consultar",
      suggestionsTitle: "Consultas frecuentes:",
      suggestions: [
        {
          label: "Quiero borrar mis datos",
          prompt: "Deseo ejercer mi derecho de supresión y solicitar el borrado de mis datos personales.",
        },
        {
          label: "¿Qué datos recopiláis?",
          prompt: "¿Qué datos personales almacena JRG Agency cuando contacto o navego?",
        },
        {
          label: "¿Cómo funcionan las cookies?",
          prompt: "¿Qué cookies utilizáis y cómo puedo bloquear las analíticas?",
        },
      ],
      eraseRequestTitle: "Baja formal de datos",
      eraseRequestAction: "Abrir email de solicitud de borrado",
    },
  },
  eu: {
    nav: {
      back: "← Hasierara itzuli",
      print: "Inprimatu",
      cookieSettings: "Cookieen ezarpenak",
      privacyAssistant: "Pribatutasun Laguntzaile Adimenduna",
      notice: "Lege Oharra",
      privacy: "Pribatutasuna",
      cookies: "Cookieak",
      terms: "Baldintzak",
      a11y: "Irisgarritasuna",
    },
    cookies: {
      title: "Pribatutasuna eta cookieak",
      desc: "Webgunearen funtzionamendurako beharrezkoak diren cookie teknikoak eta errendimendua neurtzeko analitika anonimoak erabiltzen ditugu.",
      moreInfo: "Informazio gehiago",
      configure: "Konfiguratu",
      reject: "Ukatu",
      accept: "Onartu",
      modalTitle: "Pribatutasun hobespenak",
      modalSubtitle: "Aukeratu gailu honetan zein datu prozesatzea onartzen duzun.",
      technical: "Teknikoak eta segurtasuna",
      technicalDesc: "Oinarrizko nabigaziorako eta pribatutasun aukerak gordetzeko beharrezkoak.",
      analytics: "Analitikoak eta errendimendua",
      analyticsDesc: "Webgunearen abiadura eta egonkortasuna neurtzeko datu anonimoak (Vercel).",
      preferences: "Hobespenak",
      preferencesDesc: "Aukeratutako hizkuntza eta bistaratze ezarpenak gordetzen dituzte.",
      active: "Aktiboak",
      optional: "Aukerakoa",
      downloadProof: "Deskargatu baimen agiriaz (.json)",
      save: "Gorde hautapena",
    },
    assistant: {
      title: "Pribatutasun eta Eskubideen Laguntzailea",
      subtitle: "Argitu lege zalantzak edo erabili zure DBEO eskubideak berehala.",
      disclaimer: "Gemini 3.8 Flash ereduak kudeatua. Ez du aholkularitza juridiko ofiziala ordezkatzen.",
      placeholder: "Galdetu zure datuei buruz edo eskatu ezabatzea...",
      send: "Galdetu",
      suggestionsTitle: "Galdera arruntenak:",
      suggestions: [
        {
          label: "Nire datuak ezabatu nahi ditut",
          prompt: "Nire datu pertsonalak ezabatzeko eskubidea erabili nahi dut.",
        },
        {
          label: "Zein datu biltzen dituzue?",
          prompt: "Zein datu pertsonal gordetzen ditu JRG Agencyk harremanetan jartzean?",
        },
        {
          label: "Nola funtzionatzen dute cookieek?",
          prompt: "Zein cookie erabiltzen dituzue eta nola blokeatu ditzaket analitikoak?",
        },
      ],
      eraseRequestTitle: "Datuak ezabatzeko eskaera",
      eraseRequestAction: "Ireki ezabaketa eskaera posta",
    },
  },
  en: {
    nav: {
      back: "← Back to home",
      print: "Print",
      cookieSettings: "Cookie settings",
      privacyAssistant: "AI Privacy Assistant",
      notice: "Legal Notice",
      privacy: "Privacy",
      cookies: "Cookies",
      terms: "Terms",
      a11y: "Accessibility",
    },
    cookies: {
      title: "Privacy & Cookies",
      desc: "We use technical cookies for core website functionality and anonymous analytics to measure performance.",
      moreInfo: "Learn more",
      configure: "Configure",
      reject: "Decline",
      accept: "Accept",
      modalTitle: "Privacy Preferences",
      modalSubtitle: "Choose which data you consent to process on this device.",
      technical: "Technical & Security",
      technicalDesc: "Essential for basic navigation and persisting your privacy choices.",
      analytics: "Analytics & Performance",
      analyticsDesc: "Anonymous metrics to measure speed and Core Web Vitals (Vercel).",
      preferences: "Preferences",
      preferencesDesc: "Remembers your language choice and display settings for next visits.",
      active: "Always Active",
      optional: "Optional",
      downloadProof: "Download consent receipt (.json)",
      save: "Save preferences",
    },
    assistant: {
      title: "Privacy & Data Rights Assistant",
      subtitle: "Ask legal questions or exercise your GDPR rights in seconds.",
      disclaimer: "Powered by Gemini 3.8 Flash. Does not replace formal legal counsel.",
      placeholder: "Ask about your data or request data deletion...",
      send: "Ask",
      suggestionsTitle: "Common requests:",
      suggestions: [
        {
          label: "Delete my personal data",
          prompt: "I want to exercise my right to erasure (GDPR Article 17) and request deletion of my data.",
        },
        {
          label: "What data do you collect?",
          prompt: "What personal data does JRG Agency collect when I visit or contact?",
        },
        {
          label: "How do your cookies work?",
          prompt: "What cookies are used and how can I disable non-essential ones?",
        },
      ],
      eraseRequestTitle: "Formal data erasure request",
      eraseRequestAction: "Open draft erasure email",
    },
  },
};
