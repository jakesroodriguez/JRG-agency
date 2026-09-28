import React, { useEffect, useRef, useState } from 'react';
import './mobile.css';
import { initSplineRobot } from './splineRobot';

    // Configuración de EmailJS - Reemplaza con tus credenciales de emailjs.com para recibir correos reales
    const EMAILJS_CONFIG = {
      PUBLIC_KEY: 'YOUR_PUBLIC_KEY',     // Pega aquí tu Public Key de EmailJS
      SERVICE_ID: 'YOUR_SERVICE_ID',     // Pega aquí tu Service ID de EmailJS (ej. service_gmail)
      TEMPLATE_ID: 'YOUR_TEMPLATE_ID'    // Pega aquí tu Template ID de EmailJS
    };

    const TRANSLATIONS = {
      es: {
        bootTag: "SISTEMA V2.6 // JRG AGENCY",
        bootHook1: "Las páginas web comunes solo informan.",
        bootHook2: "Las webs extraordinarias fascinan y convierten.",
        bootHookSub: "Estás a punto de experimentar el estándar web del futuro.",
        bootStep0: "01 · SINCRONIZANDO MOTORES 3D",
        bootStep1: "02 · CALIBRANDO INTERFAZ LIQUID GLASS",
        bootStep2: "03 · CARGANDO ROBOT INTERACTIVO",
        bootStep3: "04 · SISTEMA LISTO · INICIALIZANDO",
        bootSkip: "Saltar intro",
        bootMeta1: "DESARROLLO WEB",
        bootMeta2: "PAÍS VASCO · 2026",
        availChip: "Disponible para nuevos proyectos",
        heroSubtitle: "Creo experiencias digitales que combinan diseño de alto impacto, tecnología 3D y rendimiento real.",
        heroSubtitleEm: "Tu próximo proyecto, hecho para destacar.",
        btnTalk: "Hablemos de tu proyecto",
        btnWork: "Ver trabajos",
        services: "Skills & Habilidades",
        servicesTitle: "Todo lo que necesitas para destacar online",
        servicesDesc: "Combino estrategia de producto, UI de alto nivel y tecnología 3D para que tu marca no pase desapercibida.",
        portfolio: "Portfolio",
        portfolioTitle: "De la idea al deploy en semanas, no meses",
        portfolioDesc: "CRMs, landings, SaaS y dashboards con el mismo ADN visual: oscuro, elegante y acentos en gris oscuro.",
        ctaBadge: "Respuesta en 24h",
        ctaTitleLine: "¿Listo para destacar",
        ctaTitleGrad: "en el mundo digital?",
        ctaDesc: "Diseño premium, animaciones fluidas y rendimiento extremo. Cuéntame tu visión y la haremos realidad. Sin compromiso.",
        ctaTrust1: "Sin compromiso",
        ctaTrust2: "Respuesta <24h",
        ctaTrust3: "Presupuesto gratis",
        ctaFormTitle: "Empieza ahora",
        ctaFormSubtitle: "Introduce tu email y hablamos",
        ctaSubmit: "Enviar mensaje",
        ctaSending: "Enviando…",
        ctaSuccessTitle: "¡Mensaje enviado!",
        ctaSuccessText: "Te contactaré en menos de 24 horas.",
        ctaRetry: "Enviar otro",
        ctaOr: "o si prefieres",
        ctaWa: "Háblame por WhatsApp",
        footerNext: "¿Tu próximo proyecto?",
        footerMake: "Hagamos algo",
        footerTogether: "increíble juntos",
        footerStart: "Empezar proyecto",
        footerDesc: "Diseñador y desarrollador de interfaces web interactivas. Fusionando diseño 3D, animaciones fluidas y código moderno para crear experiencias digitales inolvidables.",
        footerAvail: "Disponible Q3/Q4 2026",
        footerExplore: "Explorar",
        footerConnect: "Conectar",
        navServices: "Skills",
        navWork: "Trabajo",
        navContact: "Contacto",
        navStart: "Empezar",
        btt: "Volver arriba",
        loading3d: "Cargando robot…",
        mapsLabel: "SEO Local",
        mapsTitle: "Domina Google Maps y capta clientes",
        mapsDesc: "Convierte búsquedas locales en ventas reales mejorando tu visibilidad y reputación. Destaca sobre tu competencia directa.",
        mapsReviewName: "María G.",
        mapsReviewText: "«Increíble trato y profesionalidad. Totalmente recomendado.»",
        mapsReviewTime: "Hace 2 horas",
        myGoogleTitle: "Mi perfil de Google",
        myGoogleDesc: "¿Te ha gustado trabajar conmigo? ¡Déjame una reseña en Google Maps y ayúdame a seguir creciendo!",
        myGoogleBtn: "Dejar una reseña",
        seoTitle: "JRG Agency | Diseñador & Desarrollador Web Freelance en el País Vasco",
        seoDesc: "Creador de páginas web y desarrollador freelance en el País Vasco (JRG Agency). Especialista en diseño web interactivo, SEO local y rendimiento.",
      },
      en: {
        bootTag: "SYSTEM V2.6 // JRG AGENCY",
        bootHook1: "Ordinary websites merely inform.",
        bootHook2: "Extraordinary websites captivate and convert.",
        bootHookSub: "You are about to experience next-generation web design.",
        bootStep0: "01 · SYNCHRONIZING 3D ENGINES",
        bootStep1: "02 · CALIBRATING LIQUID GLASS UI",
        bootStep2: "03 · PRELOADING INTERACTIVE ROBOT",
        bootStep3: "04 · SYSTEM READY · LAUNCHING",
        bootSkip: "Skip intro",
        bootMeta1: "WEB DEVELOPMENT",
        bootMeta2: "BASQUE COUNTRY · 2026",
        availChip: "Available for new projects",
        heroSubtitle: "I build digital experiences combining high-impact design, 3D technology, and real-world performance.",
        heroSubtitleEm: "Your next project, designed to stand out.",
        btnTalk: "Let's talk about your project",
        btnWork: "View works",
        services: "Skills & Capabilities",
        servicesTitle: "Everything you need to stand out online",
        servicesDesc: "I combine product strategy, high-level UI, and 3D technology to ensure your brand gets noticed.",
        portfolio: "Portfolio",
        portfolioTitle: "From idea to deploy in weeks, not months",
        portfolioDesc: "CRMs, landings, SaaS, and dashboards with the same visual DNA: clean, elegant, with dark gray accents.",
        ctaBadge: "24h response time",
        ctaTitleLine: "Ready to elevate",
        ctaTitleGrad: "your digital presence?",
        ctaDesc: "Premium design, fluid animations, and extreme performance. Tell me about your vision and let's make it real. No strings attached.",
        ctaTrust1: "No commitment",
        ctaTrust2: "Response <24h",
        ctaTrust3: "Free quote",
        ctaFormTitle: "Start now",
        ctaFormSubtitle: "Enter your email and let's talk",
        ctaSubmit: "Send message",
        ctaSending: "Sending…",
        ctaSuccessTitle: "Message sent!",
        ctaSuccessText: "I will contact you in less than 24 hours.",
        ctaRetry: "Send another",
        ctaOr: "or if you prefer",
        ctaWa: "Chat on WhatsApp",
        footerNext: "Your next project?",
        footerMake: "Let's make something",
        footerTogether: "incredible together",
        footerStart: "Start project",
        footerDesc: "Designer and developer of interactive web interfaces. Fusing 3D design, fluid animations, and modern code to build unforgettable digital experiences.",
        footerAvail: "Available Q3/Q4 2026",
        footerExplore: "Explore",
        footerConnect: "Connect",
        navServices: "Skills",
        navWork: "Work",
        navContact: "Contact",
        navStart: "Get Started",
        btt: "Back to top",
        loading3d: "Loading robot…",
        mapsLabel: "Local SEO",
        mapsTitle: "Dominate Google Maps & attract clients",
        mapsDesc: "Turn local searches into real sales by improving your visibility and reputation. Stand out from your direct competition.",
        mapsReviewName: "Sarah M.",
        mapsReviewText: "«Incredible service and professionalism. Highly recommended.»",
        mapsReviewTime: "2 hours ago",
        myGoogleTitle: "My Google Profile",
        myGoogleDesc: "Did you enjoy working with me? Leave me a review on Google Maps and help me keep growing!",
        myGoogleBtn: "Leave a review",
        seoTitle: "JRG Agency | Freelance Web Designer & Developer in the Basque Country",
        seoDesc: "Website creator and freelance developer in the Basque Country (JRG Agency). Specialist in interactive web design, local SEO, and performance.",
      },
      eu: {
        bootTag: "SISTEMA V2.6 // JRG AGENCY",
        bootHook1: "Ohiko webguneek informatu besterik ez dute egiten.",
        bootHook2: "Webgune bereziek liluratu eta bihurtu egiten dute.",
        bootHookSub: "Inpaktu handiko etorkizuneko web diseinua bizitzear zaude.",
        bootStep0: "01 · 3D MOTORRAK SINKRONIZATZEN",
        bootStep1: "02 · LIQUID GLASS INTERFAZEA KALIBRATZEN",
        bootStep2: "03 · ROBOT INTERAKTIBOA KARGATZEN",
        bootStep3: "04 · SISTEMA PREST · HASIERATZEN",
        bootSkip: "Sarrera saltatu",
        bootMeta1: "WEB GARAPENA",
        bootMeta2: "EUSKADI · 2026",
        availChip: "Proiektu berrietarako erabilgarri",
        heroSubtitle: "Inpaktu handiko diseinua, 3D teknologia eta errendimendu erreala uztartzen dituzten esperientzia digitalak sortzen ditut.",
        heroSubtitleEm: "Zure hurrengo proiektua, nabarmentzeko egina.",
        btnTalk: "Hitz egin dezagun zure proiektuari buruz",
        btnWork: "Ikusi lanak",
        services: "Trebetasunak & Gaitasunak",
        servicesTitle: "Sarean nabarmentzeko behar duzun guztia",
        servicesDesc: "Produktu estrategia, maila altuko UI diseinua eta 3D teknologia konbinatzen ditut marka nabarmendu dadin.",
        portfolio: "Portfolioa",
        portfolioTitle: "Ideiatik hedapenera aste gutxitan",
        portfolioDesc: "CRMak, rantza-orriak, SaaS eta panelak egitura bisual berdinarekin: iluna, dotorea eta gris iluneko xehetasunekin.",
        ctaBadge: "Erantzuna 24 ordutan",
        ctaTitleLine: "Zure presentzia digitala",
        ctaTitleGrad: "nabarmentzeko prest?",
        ctaDesc: "Premium diseinua, animazio arinak eta muturreko errendimendua. Kontaidazu zure ikuspegia eta egi bihurtuko dugu. Konpromisorik gabe.",
        ctaTrust1: "Konpromisorik gabe",
        ctaTrust2: "Erantzuna <24h",
        ctaTrust3: "Doako aurrekontua",
        ctaFormTitle: "Hasi orain",
        ctaFormSubtitle: "Idatzi zure posta elektronikoa eta hitz egingo dugu",
        ctaSubmit: "Bidali mezua",
        ctaSending: "Bidaltzen…",
        ctaSuccessTitle: "Mezua bidalita!",
        ctaSuccessText: "24 ordu baino gutxiagoan jarriko naiz zurekin harremanetan.",
        ctaRetry: "Bidali beste bat",
        ctaOr: "edo nahiago baduzu",
        ctaWa: "Hitz egin WhatsApp bidez",
        footerNext: "Zure hurrengo proiektua?",
        footerMake: "Egin dezagun zerbait",
        footerTogether: "sinestezina elkarrekin",
        footerStart: "Hasi proiektua",
        footerDesc: "Web interfaze interaktiboen diseinatzaile eta garatzailea. 3D diseinua, animazio arinak eta kode modernoa bateratzen ditut esperientzia digital ahaztezinak sortzeko.",
        footerAvail: "Erabilgarri Q3/Q4 2026",
        footerExplore: "Arakatu",
        footerConnect: "Konektatu",
        navServices: "Trebetasunak",
        navWork: "Lana",
        navContact: "Kontaktua",
        navStart: "Hasi",
        btt: "Itzuli gora",
        loading3d: "Robota kargatzen…",
        mapsLabel: "Tokiko SEOa",
        mapsTitle: "Menderatu Google Maps eta erakarri bezeroak",
        mapsDesc: "Tokiko bilaketak benetako salmenta bihurtu zure ikusgarritasuna eta ospea hobetuz. Nabarmentzen lehiakideen gainetik.",
        mapsReviewName: "Miren G.",
        mapsReviewText: "«Tratu eta profesionaltasun ezin hobea. Erabat gomendagarria.»",
        mapsReviewTime: "Duela 2 ordu",
        myGoogleTitle: "Nire Google Profila",
        myGoogleDesc: "Nirekin lan egitea gustatu zaizu? Utzi iezadazu iritzia Google Maps-en eta lagundu hazten jarraitzen!",
        myGoogleBtn: "Iritzia utzi",
        seoTitle: "JRG Agency | Web Diseinatzaile eta Garatzaile Freelancea Euskal Herrian",
        seoDesc: "Webguneen sortzailea eta garatzaile freelancea Euskal Herrian (JRG Agency). Web diseinu interaktiboan, tokiko SEOan eta errendimenduan aditua.",
      }
    };

    const getFeatures = (lang) => [
      {
        id: 0,
        icon: 'layers',
        badge: lang === 'es' ? 'UI & 3D INMERSIVO' : lang === 'en' ? 'IMMERSIVE UI & 3D' : 'UI ETA 3D INMERSIBOA',
        title: lang === 'es' ? 'Diseño inmersivo' : lang === 'en' ? 'Immersive Design' : 'Diseinu murgiltzailea',
        shortDesc: lang === 'es' 
          ? 'Modelos 3D interactivos y WebGL que captan atención al instante.'
          : lang === 'en'
          ? 'Interactive 3D models and WebGL capturing attention instantly.'
          : 'Ikusizko sakontasuna eta 3D efektuak arreta lehen segundotik bereganatzeko.',
        fullDesc: lang === 'es' 
          ? 'Creamos experiencias visuales envolventes que diferencian tu negocio de la competencia. No usamos plantillas genéricas; diseñamos entornos tridimensionales donde cada interacción genera interés, retención y confianza.'
          : lang === 'en'
          ? 'We craft immersive visual experiences that set your brand apart. No generic templates; we design digital journeys where every interaction drives engagement, retention, and trust.'
          : 'Zure marka lehiatik bereizten duten esperientzia bisual murgiltzaileak sortzen ditugu. Ez dugu txantiloiekin lan egiten; konfiantza sortzen duten unibertso digitalak diseinatzen ditugu.',
        subBlocks: [
          {
            icon: 'box',
            title: lang === 'es' ? 'Modelados 3D interactivos' : lang === 'en' ? 'Interactive 3D Models' : '3D modelo interaktiboak',
            desc: lang === 'es'
              ? 'Escenas y modelos 3D que el visitante puede rotar y explorar en tiempo real sin salir del navegador.'
              : lang === 'en'
              ? '3D scenes and assets that visitors can freely rotate and explore in real-time in their browser.'
              : 'Erabiltzaileak nabigatzailean denbora errealean biratu eta ikus ditzakeen 3D eszenak eta ereduak.',
            tag: 'Spline · Three.js'
          },
          {
            icon: 'sparkles',
            title: lang === 'es' ? 'Interfaces WebGL a 60 FPS' : lang === 'en' ? 'Fluid 60 FPS WebGL' : 'WebGL interfazeak 60 FPS-tan',
            desc: lang === 'es'
              ? 'Efectos visuales y shaders acelerados por la gráfica, manteniendo la máxima fluidez en teléfonos móviles.'
              : lang === 'en'
              ? 'GPU-accelerated visual effects and shaders, ensuring silky-smooth performance on mobile devices.'
              : 'Txartel grafikoak azeleratutako efektuak eta shader-ak, mugikorretan errendimendu arina lortzeko.',
            tag: 'WebGL · Shaders GLSL'
          },
          {
            icon: 'film',
            title: lang === 'es' ? 'Motion Design cinemático' : lang === 'en' ? 'Cinematic Motion Design' : 'Motion Diseinu zinematikoa',
            desc: lang === 'es'
              ? 'Micro-animaciones coordinadas con el scroll que dinamizan la lectura y guían al contacto.'
              : lang === 'en'
              ? 'Scroll-synchronized micro-animations that make browsing dynamic and guide visitors to take action.'
              : 'Erabiltzailearen scroll-arekin sinkronizatutako mikro-animazioak, irakurketa erraztuz.',
            tag: 'GSAP · Lenis Scroll'
          }
        ],
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(167, 139, 250, 0.04) 100%)',
        accentColor: '#6366f1',
        glowColor: '99, 102, 241'
      },
      {
        id: 1,
        icon: 'code-2',
        badge: lang === 'es' ? 'CÓDIGO & PRESTACIONES' : lang === 'en' ? 'CODE & PERFORMANCE' : 'KODEA ETA ETEKINA',
        title: lang === 'es' ? 'Desarrollo moderno' : lang === 'en' ? 'Modern Development' : 'Garapen modernoa',
        shortDesc: lang === 'es'
          ? 'React, TypeScript y código modular optimizado para máxima velocidad.'
          : lang === 'en'
          ? 'React, TypeScript, and modular code optimized for ultra-fast speed.'
          : 'React, TypeScript eta kode modularra abiadura handiena lortzeko.',
        fullDesc: lang === 'es'
          ? 'Construimos con el stack frontend más moderno y fiable de la industria. Cada línea de código está optimizada para cargar al instante, posicionar en Google y ofrecer una experiencia robusta sin errores.'
          : lang === 'en'
          ? 'We build with the most modern, reliable frontend stack in the industry. Every line of code is optimized for instant loading, top SEO ranking, and bulletproof stability.'
          : 'Industriako frontend stack fidagarrienarekin eraikitzen dugu. Kode guztia berehala kargatzeko eta fidagarritasuna bermatzeko optimizatuta dago.',
        subBlocks: [
          {
            icon: 'code',
            title: lang === 'es' ? 'Código semántico y modular' : lang === 'en' ? 'Semantic & Modular Code' : 'Kode semantiko eta modularra',
            desc: lang === 'es'
              ? 'Componentes React limpios tipados con TypeScript. Estructura limpia y fácil de actualizar con el tiempo.'
              : lang === 'en'
              ? 'Clean React components typed with TypeScript. Organized structure that is effortless to maintain and scale.'
              : 'TypeScript-ekin idatzitako React osagai garbiak. Etorkizunean mantentzeko eta handitzeko oso erraza.',
            tag: 'React 18 · TypeScript'
          },
          {
            icon: 'zap',
            title: lang === 'es' ? 'Core Web Vitals al 100%' : lang === 'en' ? 'Core Web Vitals 100%' : 'Core Web Vitals %100ean',
            desc: lang === 'es'
              ? 'Puntuaciones máximas en Google Lighthouse. Carga ultrarrápida para no perder ni un solo cliente por espera.'
              : lang === 'en'
              ? 'Top scores on Google Lighthouse. Ultra-fast initial paint so you never lose visitors due to slow loading.'
              : 'Puntuazio gorena Google Lighthouse-n. Karga azkarra itxaronaldiengatik bezerorik ez galtzeko.',
            tag: 'Lighthouse 95-100 · Speed'
          },
          {
            icon: 'server',
            title: lang === 'es' ? 'Despliegues en Edge & CDN' : lang === 'en' ? 'Edge Deployments & CDN' : 'Hedapenak Edge & CDN-n',
            desc: lang === 'es'
              ? 'Alojamiento global con Vercel. Servidores distribuidos por todo el mundo con seguridad SSL y máxima disponibilidad.'
              : lang === 'en'
              ? 'Global edge hosting via Vercel. Geographically distributed servers with instant SSL and 99.9% uptime.'
              : 'Vercel bidezko hedapen globala. Mundu osoan zehar banatutako zerbitzari azkarrak eta SSL segurua.',
            tag: 'Vercel Edge · Global CDN'
          }
        ],
        gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(99, 102, 241, 0.04) 100%)',
        accentColor: '#06b6d4',
        glowColor: '6, 182, 212'
      },
      {
        id: 2,
        icon: 'rocket',
        badge: lang === 'es' ? 'VELOCIDAD & SEO' : lang === 'en' ? 'SPEED & SEO' : 'ABIADURA ETA SEO',
        title: lang === 'es' ? 'Lanzamiento rápido' : lang === 'en' ? 'Fast Launch' : 'Abiarazte azkarra',
        shortDesc: lang === 'es'
          ? 'De idea a producción con métricas claras y captación directa.'
          : lang === 'en'
          ? 'From idea to production with clear metrics and direct customer leads.'
          : 'Ideiatik produkziora metrika argiekin eta bezeroak erakarriz.',
        fullDesc: lang === 'es'
          ? 'Priorizamos entregas ágiles y orientadas a resultados reales de negocio. Diseñamos con un objetivo clave: que tu nueva web empiece a captar llamadas, mensajes de WhatsApp y presupuestos desde la primera semana.'
          : lang === 'en'
          ? 'We focus on agile delivery oriented towards real business results. Designed with one main goal: your website starts generating calls, WhatsApp messages, and quote inquiries from week one.'
          : 'Negozio-emaitza errealetara bideratutako entrega arina lehenesten dugu: zure webguneak deiak eta mezuak lortzea lehen astetik bertatik.',
        subBlocks: [
          {
            icon: 'search',
            title: lang === 'es' ? 'Auditoría y SEO Local' : lang === 'en' ? 'Technical & Local SEO' : 'SEO teknikoa eta tokikoa',
            desc: lang === 'es'
              ? 'Optimización de etiquetas y estructura para aparecer en Google y en Google Maps cuando busquen en tu ciudad.'
              : lang === 'en'
              ? 'Complete schema and keyword optimization to rank on Google search and Google Maps in your local area.'
              : 'Etiketa eta egitura optimizazioa zure inguruan bilatzen dutenean Google-n lehen agertzeko.',
            tag: 'Google Maps · SEO Local'
          },
          {
            icon: 'target',
            title: lang === 'es' ? 'Estrategia MVP enfocada' : lang === 'en' ? 'Focused MVP Strategy' : 'MVP estrategia bideratua',
            desc: lang === 'es'
              ? 'Lanzamiento sin rodeos con botones directos a WhatsApp y llamadas estratégicas que aumentan la conversión.'
              : lang === 'en'
              ? 'Streamlined launch with direct WhatsApp links and clear call-to-action buttons that convert visitors.'
              : 'Bihurketa handitzen duten WhatsApp eta deietarako botoi estrategikoekin egindako abiaraztea.',
            tag: 'Conversión UX · CTAs'
          },
          {
            icon: 'bar-chart-2',
            title: lang === 'es' ? 'Métricas y Analítica en vivo' : lang === 'en' ? 'Live Analytics & Tracking' : 'Zuzeneko metrika eta analitika',
            desc: lang === 'es'
              ? 'Configuración de Google Analytics para conocer exactamente cuántos usuarios te visitan y qué páginas ven.'
              : lang === 'en'
              ? 'Google Analytics setup so you know exactly who visits, where they come from, and what they click.'
              : 'Google Analytics integrazioa bisitariak nondik datozen eta zer ikusten duten jakiteko.',
            tag: 'Google Analytics 4 · KPIs'
          }
        ],
        gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.04) 0%, rgba(6, 182, 212, 0.04) 100%)',
        accentColor: '#34d399',
        glowColor: '52, 211, 153'
      }
    ];

    const getStats = (lang) => [
      { value: '50+', label: lang === 'es' ? 'Proyectos entregados' : lang === 'en' ? 'Projects delivered' : 'Bidalitako proiektuak' },
      { value: '3×', label: lang === 'es' ? 'Más engagement' : lang === 'en' ? 'More engagement' : 'Engagement gehiago' },
      { value: '24h', label: lang === 'es' ? 'Tiempo de respuesta' : lang === 'en' ? 'Response time' : 'Erantzun denbora' }
    ];

    function Sparkles({ minSize = 0.4, maxSize = 1.4, particleDensity = 60, particleColor = '#212529' }) {
      const canvasRef = useRef(null);

      useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let particles = [];

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width * window.devicePixelRatio;
          canvas.height = rect.height * window.devicePixelRatio;
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resize();
        window.addEventListener('resize', resize);

        const count = particleDensity;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * (canvas.width / window.devicePixelRatio),
            y: Math.random() * (canvas.height / window.devicePixelRatio),
            size: Math.random() * (maxSize - minSize) + minSize,
            speedY: -(Math.random() * 0.3 + 0.05),
            opacity: Math.random(),
            fadeSpeed: Math.random() * 0.015 + 0.005,
            direction: Math.random() > 0.5 ? 1 : -1
          });
        }

        const draw = () => {
          ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
          
          particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = p.opacity;
            ctx.fill();

            p.y += p.speedY;
            p.opacity += p.fadeSpeed * p.direction;

            if (p.opacity >= 1) {
              p.direction = -1;
            } else if (p.opacity <= 0) {
              p.direction = 1;
              p.y = canvas.height / window.devicePixelRatio;
              p.x = Math.random() * (canvas.width / window.devicePixelRatio);
            }

            if (p.y < 0) {
              p.y = canvas.height / window.devicePixelRatio;
              p.x = Math.random() * (canvas.width / window.devicePixelRatio);
            }
          });

          animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
          window.removeEventListener('resize', resize);
          cancelAnimationFrame(animationFrameId);
        };
      }, [minSize, maxSize, particleDensity, particleColor]);

      return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
    }

    function ContainerScroll({ titleComponent, children, plainCard = false }) {
      const containerRef = useRef(null);
      const [scrollProgress, setScrollProgress] = useState(0);
      const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        
        const checkMobile = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        let ticking = false;
        const handleScroll = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const container = containerRef.current;
              if (container) {
                const rect = container.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const range = viewportHeight * 0.6;
                const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / range));
                setScrollProgress((prev) => Math.max(prev, progress));
              }
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
          window.removeEventListener('resize', checkMobile);
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

      // Mapear transformaciones según Aceternity Container Scroll
      const rotateX = 20 - (scrollProgress * 20); // 20 a 0
      const scale = isMobile 
        ? 0.9 + (scrollProgress * 0.1) // 0.9 a 1.0
        : 1.06 - (scrollProgress * 0.06); // 1.06 a 1.00
      const translateY = isMobile
        ? -30 + (scrollProgress * 30) // -30px a 0px en móvil
        : -120 + (scrollProgress * 120); // -120px a 0px en PC

      return (
        <div 
          ref={containerRef} 
          className="container-scroll-outer"
          style={{ perspective: isMobile ? 'none' : '1000px' }}
        >
          <div 
            className="container-scroll-header"
            style={{ 
              transform: isMobile ? 'none' : `translateY(${translateY}px)`,
              opacity: isMobile ? 1 : Math.min(1, scrollProgress * 1.5)
            }}
          >
            {titleComponent}
          </div>
          <div 
            className={plainCard ? "container-scroll-card-plain" : "container-scroll-card"}
            style={{ 
              transform: isMobile ? 'none' : `rotateX(${rotateX}deg) scale(${scale})`,
            }}
          >
            <div className={plainCard ? "" : "container-scroll-card-inner"}>
              {children}
            </div>
          </div>
        </div>
      );
    }

    function InteractiveFeatures({ lang = 'es' }) {
      const [expandedId, setExpandedId] = useState(null);
      const features = getFeatures(lang);

      const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
      };

      useEffect(() => {
        if (typeof window !== 'undefined' && window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
      }, [expandedId, lang]);

      return (
        <div className="features-accordion-container">
          {features.map((feature) => {
            const isExpanded = expandedId === feature.id;
            return (
              <article
                key={feature.id}
                className={`feature-accordion-card ${isExpanded ? 'is-expanded' : ''}`}
                style={{
                  '--accent-color': feature.accentColor,
                  '--glow-color': feature.glowColor,
                  background: isExpanded ? undefined : feature.gradient
                }}
              >
                {/* Header Clickable Area */}
                <div 
                  className="feature-accordion-header"
                  onClick={() => toggleExpand(feature.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter' || e.key === ' ') { 
                      e.preventDefault(); 
                      toggleExpand(feature.id); 
                    } 
                  }}
                >
                  <div className="feature-header-left">
                    <div 
                      className="feature-icon-box" 
                      style={{ 
                        background: `rgba(${feature.glowColor}, 0.12)`, 
                        borderColor: `rgba(${feature.glowColor}, 0.25)` 
                      }}
                    >
                      <i data-lucide={feature.icon} style={{ color: feature.accentColor, width: 22, height: 22 }}></i>
                    </div>
                    <div className="feature-header-text">
                      <div className="feature-badge-row">
                        <span 
                          className="feature-mini-badge" 
                          style={{ 
                            color: feature.accentColor, 
                            background: `rgba(${feature.glowColor}, 0.08)`, 
                            borderColor: `rgba(${feature.glowColor}, 0.22)` 
                          }}
                        >
                          {feature.badge}
                        </span>
                      </div>
                      <h3 className="feature-accordion-title">{feature.title}</h3>
                      {!isExpanded && (
                        <p className="feature-accordion-teaser">{feature.shortDesc}</p>
                      )}
                    </div>
                  </div>

                  <div className="feature-header-right">
                    <button 
                      type="button" 
                      className={`feature-toggle-btn ${isExpanded ? 'btn-expanded' : ''}`}
                      style={{
                        color: isExpanded ? feature.accentColor : 'var(--text-secondary)',
                        borderColor: isExpanded ? `rgba(${feature.glowColor}, 0.35)` : 'rgba(var(--navy-rgb), 0.12)',
                        background: isExpanded ? `rgba(${feature.glowColor}, 0.08)` : 'rgba(255, 255, 255, 0.7)'
                      }}
                      aria-label={isExpanded ? 'Plegar detalles' : 'Desplegar detalles'}
                    >
                      <span className="toggle-btn-label">
                        {isExpanded 
                          ? (lang === 'eu' ? 'Itxi' : lang === 'en' ? 'Close' : 'Plegar')
                          : (lang === 'eu' ? 'Ikusi' : lang === 'en' ? 'Details' : 'Ver más')}
                      </span>
                      <svg 
                        viewBox="0 0 24 24" 
                        width="14" 
                        height="14" 
                        stroke="currentColor" 
                        strokeWidth="2.2" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ 
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Content Area */}
                <div 
                  className="feature-accordion-collapse"
                  style={{
                    maxHeight: isExpanded ? '1600px' : '0px',
                    opacity: isExpanded ? 1 : 0,
                    transition: 'max-height 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div className="feature-expanded-content">
                    {/* Accent divider */}
                    <div 
                      className="feature-expanded-divider" 
                      style={{ background: `linear-gradient(to right, ${feature.accentColor}, rgba(${feature.glowColor}, 0.1) 80%, transparent)` }}
                    ></div>

                    {/* Comprehensive explanation paragraph */}
                    <p className="feature-expanded-description">
                      {feature.fullDesc}
                    </p>

                    {/* 3 Dedicated Sub-blocks */}
                    <div className="feature-subblocks-section">
                      <div className="subblocks-label-bar">
                        <span className="subblocks-label" style={{ color: feature.accentColor }}>
                          {lang === 'es' ? '3 Bloques clave de este servicio:' : lang === 'en' ? '3 Key Pillars of this Service:' : 'Zerbitzu honen 3 zutabe nagusiak:'}
                        </span>
                      </div>

                      <div className="feature-subblocks-grid">
                        {feature.subBlocks.map((block, idx) => (
                          <div key={idx} className="feature-subblock-card">
                            <div className="subblock-top">
                              <div className="subblock-icon-wrap" style={{ background: `rgba(${feature.glowColor}, 0.1)`, color: feature.accentColor }}>
                                <i data-lucide={block.icon} style={{ width: 17, height: 17 }}></i>
                              </div>
                              <span className="subblock-tag" style={{ borderColor: `rgba(${feature.glowColor}, 0.2)` }}>
                                {block.tag}
                              </span>
                            </div>
                            <h4 className="subblock-title">{block.title}</h4>
                            <p className="subblock-desc">{block.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action footer */}
                    <div className="feature-expanded-footer">
                      <a href="#contact" className="feature-cta-link" style={{ borderColor: `rgba(${feature.glowColor}, 0.3)`, color: feature.accentColor }}>
                        <span>{lang === 'es' ? 'Consultar sobre este servicio' : lang === 'en' ? 'Inquire about this service' : 'Zerbitzu honi buruz galdetu'}</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </a>
                      <button 
                        type="button" 
                        className="feature-close-text-btn"
                        onClick={(e) => { e.stopPropagation(); toggleExpand(feature.id); }}
                      >
                        {lang === 'es' ? 'Plegar detalles' : lang === 'en' ? 'Close' : 'Itxi'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    function ShowcasePipeline({ lang = 'es' }) {
      const [activeStep, setActiveStep] = useState(0);
      const [progress, setProgress] = useState(0);

      const steps = [
        {
          id: 0,
          label: lang === 'es' ? '1. Diseño (UI/3D)' : lang === 'en' ? '1. Design (UI/3D)' : '1. Diseinua (UI/3D)',
          title: 'Figma & Spline Space',
          status: lang === 'es' ? 'Diseñando ADN visual...' : lang === 'en' ? 'Designing visual DNA...' : 'ADN bisuala diseinatzen...',
          badge: 'Figma 3D Layout',
          icon: 'layers'
        },
        {
          id: 1,
          label: lang === 'es' ? '2. Desarrollo (React)' : lang === 'en' ? '2. Dev (React)' : '2. Garapena (React)',
          title: 'VS Code Editor',
          status: lang === 'es' ? 'Generando componentes WebGL...' : lang === 'en' ? 'Generating WebGL components...' : 'WebGL osagaiak sortzen...',
          badge: 'React & Three.js',
          icon: 'code-2'
        },
        {
          id: 2,
          label: lang === 'es' ? '3. Deploy (Edge)' : lang === 'en' ? '3. Deploy (Edge)' : '3. Hedapena (Edge)',
          title: 'Edge Deployment Pipeline',
          status: lang === 'es' ? 'Compilando e inyectando en CDN...' : lang === 'en' ? 'Compiling & injecting CDN...' : 'CDN-an konpilatzen eta txertatzen...',
          badge: 'Vercel / Netlify',
          icon: 'terminal'
        },
        {
          id: 3,
          label: lang === 'es' ? '4. Rendimiento (100)' : lang === 'en' ? '4. Performance (100)' : '4. Errendimendua (100)',
          title: 'Core Web Vitals',
          status: lang === 'es' ? 'Métricas óptimas listas para tráfico...' : lang === 'en' ? 'Optimal metrics ready for traffic...' : 'Metrika optimoak trafikoarako prest...',
          badge: 'Lighthouse Score',
          icon: 'activity'
        }
      ];

      useEffect(() => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              setActiveStep((current) => (current + 1) % 4);
              return 0;
            }
            return prev + 2; // Incrementar un poco más rápido para fluidez
          });
        }, 80);

        return () => clearInterval(interval);
      }, []);

      const handleStepClick = (idx) => {
        setActiveStep(idx);
        setProgress(0);
      };

      useEffect(() => {
        if (window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
      }, [activeStep]);

      const renderGraphic = () => {
        switch(activeStep) {
          case 0:
            return (
              <div key="step0" className="pipeline-figma-mock">
                <div className="figma-canvas">
                  <div className="figma-grid-back"></div>
                  <div className="figma-element-glow-card">
                    <span className="figma-coord">x: 180px, y: 40px</span>
                    <div className="figma-el-inner">
                      <div className="figma-circle-badge">3D Mesh</div>
                      <div className="figma-line-placeholder"></div>
                      <div className="figma-line-placeholder short"></div>
                    </div>
                  </div>
                  {/* Cursor JRG */}
                  <div className="figma-cursor jakes-cursor">
                    <i data-lucide="navigation" style={{ width: 12, height: 12 }}></i>
                    <span className="cursor-name">JRG (UX)</span>
                  </div>
                  {/* Cursor Client */}
                  <div className="figma-cursor client-cursor">
                    <i data-lucide="navigation" style={{ width: 12, height: 12 }}></i>
                    <span className="cursor-name">{lang === 'es' ? 'Tú (Feedback)' : 'You (Feedback)'}</span>
                  </div>
                </div>
              </div>
            );
          case 1:
            return (
              <div key="step1" className="pipeline-code-mock">
                <div className="code-header-tabs">
                  <span className="tab-item active">Card.tsx</span>
                  <span className="tab-item">App.css</span>
                </div>
                <pre className="code-editor-lines">
                  <code>
                    <span className="line-keyword">import</span> React <span className="line-keyword">from</span> <span className="line-str">'react'</span>;<br/>
                    <span className="line-keyword">import</span> &#123; Canvas &#125; <span className="line-keyword">from</span> <span className="line-str">'@react-three/fiber'</span>;<br/>
                    <br/>
                    <span className="line-keyword">export default function</span> <span className="line-func">WebGLCard</span>() &#123;<br/>
                    &nbsp;&nbsp;<span className="line-keyword">return</span> (<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="line-tag">div</span> className=<span className="line-str">"glass-card"</span>&gt;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="line-tag">Canvas</span> camera=&#123;&#123; fov: 15 &#125;&#125;&gt;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="line-tag">ambientLight</span> intensity=&#123;0.5&#125; /&gt;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="line-tag">LiquidMesh</span> /&gt;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="line-tag">Canvas</span>&gt;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="line-tag">div</span>&gt;<br/>
                    &nbsp;&nbsp;);<br/>
                    &#125;
                  </code>
                </pre>
              </div>
            );
          case 2:
            return (
              <div key="step2" className="pipeline-terminal-mock">
                <div className="terminal-body">
                  <div className="term-line cmd">$ npm run build --prod</div>
                  <div className="term-line success">✔ Creating production build...</div>
                  <div className="term-line">  Assets: bundle.js (148 kB)</div>
                  <div className="term-line">  CSS: global.css (24 kB)</div>
                  <div className="term-line cmd">$ vercel --prod</div>
                  <div className="term-line build">⚡ Uploading assets to Edge CDNs...</div>
                  <div className="term-line build">✦ Routing configured for edge compression...</div>
                  <div className="term-line success glow">✔ Production deploy success! (18s)</div>
                  <div className="term-line link">👉 https://jrgagency.com</div>
                </div>
              </div>
            );
          case 3:
            return (
              <div key="step3" className="pipeline-performance-mock">
                <div className="perf-header">
                  <div className="perf-title-row">
                    <i data-lucide="zap" className="perf-header-icon" style={{ color: '#10b981', fill: 'rgba(16, 185, 129, 0.2)', width: 18, height: 18 }}></i>
                    <span>Lighthouse Score</span>
                  </div>
                  <div className="perf-badges">
                    <span className="perf-badge">PWA Ready</span>
                    <span className="perf-badge">SEO Opt</span>
                  </div>
                </div>
                <div className="perf-grid">
                  <div className="perf-main-score">
                    <div className="perf-circle-gauge large-gauge">
                      <div className="gauge-glow-bg"></div>
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" className="gauge-back" />
                        <circle cx="50" cy="50" r="42" className="gauge-front large-gauge-front" />
                      </svg>
                      <div className="gauge-val">100</div>
                      <span className="gauge-lbl">Performance</span>
                    </div>
                  </div>
                  <div className="perf-side-scores">
                    <div className="perf-mini-gauges">
                      {['Access.', 'Best Prac.', 'SEO'].map((lbl, i) => (
                        <div className="perf-mini-gauge" key={lbl}>
                          <svg viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15" className="gauge-back-mini" />
                            <circle cx="18" cy="18" r="15" className="gauge-front-mini" style={{ animationDelay: `${i * 0.15}s` }} />
                          </svg>
                          <div className="mini-gauge-val">100</div>
                          <span className="mini-gauge-lbl">{lbl}</span>
                        </div>
                      ))}
                    </div>
                    <div className="perf-stats">
                      <div className="perf-stat-row">
                        <span className="lbl"><i data-lucide="timer" style={{ width: 14, height: 14 }}></i> First Contentful Paint</span>
                        <span className="val success">0.3s</span>
                      </div>
                      <div className="perf-stat-row">
                        <span className="lbl"><i data-lucide="monitor-smartphone" style={{ width: 14, height: 14 }}></i> Largest Contentful Paint</span>
                        <span className="val success">0.7s</span>
                      </div>
                      <div className="perf-stat-row">
                        <span className="lbl"><i data-lucide="layout-template" style={{ width: 14, height: 14 }}></i> Cumul. Layout Shift</span>
                        <span className="val success">0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div className="pipeline-container">
          {/* Navigation Bar / Tabs */}
          <div className="pipeline-navigation">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                className={`pipeline-tab ${activeStep === idx ? 'active' : ''}`}
                onClick={() => handleStepClick(idx)}
              >
                <div className="tab-progress-bg">
                  <div 
                    className="tab-progress-fill" 
                    style={{ width: activeStep === idx ? `${progress}%` : '0%' }}
                  />
                </div>
                <div className="tab-inner-content">
                  <i data-lucide={step.icon} className="tab-icon" style={{ width: 14, height: 14 }}></i>
                  <span>{step.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Browser / Shell frame */}
          <div className="pipeline-browser-frame">
            <div className="pipeline-browser-bar">
              <div className="browser-dots">
                <span></span><span></span><span></span>
              </div>
              <div className="browser-url-input">
                <i data-lucide="lock" style={{ width: 10, height: 10 }}></i>
                <span>pipeline.jrg.dev / {steps[activeStep].badge.toLowerCase().replace(/[^a-z0-9]/g, '-')}</span>
              </div>
              <div className="browser-status-badge">
                <span className="status-dot"></span>
                <span>{steps[activeStep].title}</span>
              </div>
            </div>

            <div className="pipeline-browser-body">
              {renderGraphic()}
            </div>
          </div>
        </div>
      );
    }

    // ─── Premium Language Switcher Component ─────────────────────────────────
    function LangSwitcher({ lang, setLang }) {
      const [isFlash, setIsFlash] = useState(false);

      const handleChange = (code) => {
        setLang(code);
        localStorage.setItem('jakes_lang', code);
        setIsFlash(true);
        setTimeout(() => setIsFlash(false), 550);
      };

      return (
        <div className="nav-dock-lang-segmented" data-active={lang}>
          <div
            className={`nav-dock-lang-indicator${isFlash ? ' flash' : ''}`}
            aria-hidden="true"
          />
          {['es', 'en', 'eu'].map(code => {
            const labels = { es: 'ESP', en: 'ENG', eu: 'EUS' };
            return (
              <button
                key={code}
                onClick={() => handleChange(code)}
                className={`nav-dock-lang-btn-opt${lang === code ? ' active' : ''}`}
              >
                {labels[code]}
              </button>
            );
          })}
        </div>
      );
    }

    // ─── Expandable Dock Link Component ─────────────────────────────────────
    function DockLink({ href, icon, text, isCta, alwaysExpanded }) {
      const [expanded, setExpanded] = useState(alwaysExpanded || false);

      const handleClick = (e) => {
        if (alwaysExpanded) return; // Navigate immediately

        if (!expanded) {
          e.preventDefault();
          setExpanded(true);
          setTimeout(() => {
            if (window.lucide && window.lucide.createIcons) {
              window.lucide.createIcons();
            }
          }, 0);
        } else {
          setTimeout(() => setExpanded(false), 300);
        }
      };

      const handleBlur = () => {
        if (!alwaysExpanded) {
          setExpanded(false);
        }
      };

      const baseClass = isCta ? 'nav-dock-cta' : 'nav-dock-link';
      const className = `${baseClass} ${expanded || alwaysExpanded ? 'expanded' : ''}`;

      return (
        <a 
          href={href} 
          className={className}
          onClick={handleClick}
          onBlur={handleBlur}
          aria-label={text}
          title={text}
        >
          <i data-lucide={icon} style={{ width: 15, height: 15, flexShrink: 0 }}></i>
          <span className="dock-link-text">{text}</span>
        </a>
      );
    }

    // ─── Portfolio Data & Component ──────────────────────────────────────────
    const getPortfolioProjects = (lang) => [
      {
        id: 1,
        title: 'Gure Trena',
        badge: lang === 'es' ? 'Hostelería & Gastronomía' : lang === 'en' ? 'Dining & Bar' : 'Ostalaritza',
        desc: lang === 'es' 
          ? 'El bar y restaurante tradicional de toda la vida: bocadillos, raciones, pintxos caseros y carta digital QR.' 
          : lang === 'en' 
          ? 'The classic neighborhood bar & dining: hearty sandwiches, tapas, homemade pintxos, and digital QR menu.' 
          : 'Auzoko betiko taberna: ogitartekoak, etxeko errazioak, pintxoak eta QR menu digitala.',
        image: '/portfolio-1.webp',
        link: 'https://guretrenaurretxu.com/',
        displayUrl: 'guretrenaurretxu.com',
        tech: ['React', 'Vite', 'Tailwind CSS', 'Carta QR']
      },
      {
        id: 2,
        title: 'Urkulu Móviles',
        badge: lang === 'es' ? 'Servicio Técnico & Tienda' : lang === 'en' ? 'Repair & Tech Shop' : 'Konponketa & Denda',
        desc: lang === 'es' 
          ? 'Reparación exprés de smartphones, tablets, pantallas, cambio de baterías y venta de accesorios en Urretxu.' 
          : lang === 'en' 
          ? 'Express repair for smartphones, screens, batteries, and tech accessories in Urretxu.' 
          : 'Mugikorren konponketa azkarra, pantailak, bateriak eta osagarrien salmenta Urretxun.',
        image: '/portfolio-2.webp',
        link: 'https://urkulumovilesurretxu.com/',
        displayUrl: 'urkulumovilesurretxu.com',
        tech: ['React', 'Vite', 'Tailwind CSS', 'WhatsApp API']
      },
      {
        id: 3,
        title: 'Otxaran Denda',
        badge: lang === 'es' ? 'Moda & Boutique' : lang === 'en' ? 'Fashion & Boutique' : 'Moda Denda',
        desc: lang === 'es' 
          ? 'Lookbook digital y catálogo de boutique de moda femenina con tendencias, novedades y complementos de temporada.' 
          : lang === 'en' 
          ? 'Digital lookbook and boutique catalog for women\'s fashion with trends, new arrivals, and accessories.' 
          : 'Emakumeentzako arropa denda eta lookbook digitala: azken joerak, berrikuntzak eta osagarriak.',
        image: '/portfolio-otxaran.png',
        link: 'https://otxaran-denda.vercel.app/',
        displayUrl: 'otxaran-denda.vercel.app',
        tech: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Catálogo']
      }
    ];

    function PortfolioCard({ project, lang = 'es' }) {
      useEffect(() => {
        if (window.lucide && window.lucide.createIcons) {
          window.lucide.createIcons();
        }
      }, []);

      const visitText = lang === 'es' ? 'Visitar web' : lang === 'en' ? 'Visit live site' : 'Webgunea ikusi';

      return (
        <article className="portfolio-card-premium portfolio-card">
          <div className="portfolio-browser-mockup">
            <div className="portfolio-browser-bar">
              <div className="portfolio-browser-dots" aria-hidden="true">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
              <div className="portfolio-browser-url">
                <i data-lucide="lock" style={{ width: 10, height: 10 }}></i>
                <span>{project.displayUrl}</span>
              </div>
              <div className="portfolio-live-badge">
                <span className="portfolio-live-dot"></span>
                <span>ONLINE</span>
              </div>
            </div>
            
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="portfolio-image-container portfolio-image-wrap"
              aria-label={`Visitar web de ${project.title}`}
            >
              {project.image ? (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="portfolio-preview-img portfolio-image" 
                  loading="lazy" 
                />
              ) : (
                <div className="portfolio-image-placeholder">
                  <i data-lucide="layout" style={{ width: 36, height: 36 }}></i>
                </div>
              )}
              <div className="portfolio-image-hover-overlay">
                <span className="portfolio-overlay-btn">
                  <span>{visitText}</span>
                  <i data-lucide="arrow-up-right" style={{ width: 16, height: 16 }}></i>
                </span>
              </div>
            </a>
          </div>

          <div className="portfolio-card-body portfolio-content">
            <div className="portfolio-card-header-row">
              <div className="portfolio-title-group">
                <span className="portfolio-category-badge">{project.badge}</span>
                <h3 className="portfolio-project-title portfolio-title">{project.title}</h3>
              </div>
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="portfolio-action-link"
                title={visitText}
              >
                <span>{visitText}</span>
                <i data-lucide="arrow-up-right" style={{ width: 13, height: 13 }}></i>
              </a>
            </div>

            <p className="portfolio-project-desc portfolio-desc">{project.desc}</p>

            <div className="portfolio-tech-chips-wrap portfolio-tech-list">
              {project.tech.map((t, i) => (
                <span key={i} className="portfolio-pill portfolio-tech-chip">{t}</span>
              ))}
            </div>
          </div>
        </article>
      );
    }

    function LandingPage() {
      const [email, setEmail] = useState('');
      const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
      const [lang, setLang] = useState(() => localStorage.getItem('jakes_lang') || 'es');
      const [isNavExpanded, setIsNavExpanded] = useState(false);
      const [bootProgress, setBootProgress] = useState(0);
      const [bootStage, setBootStage] = useState(0);
      const [isBootExiting, setIsBootExiting] = useState(false);
      const [isBootDone, setIsBootDone] = useState(false);
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const [isScrolled, setIsScrolled] = useState(false);

      const t = TRANSLATIONS[lang];

      useEffect(() => {
        document.documentElement.lang = lang;
        
        // SEO Dynamic Updates
        if (t.seoTitle) {
          document.title = t.seoTitle;
        }
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.seoDesc) {
          metaDesc.setAttribute('content', t.seoDesc);
        }
        
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && t.seoTitle) {
          ogTitle.setAttribute('content', t.seoTitle);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && t.seoDesc) {
          ogDesc.setAttribute('content', t.seoDesc);
        }
        
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle && t.seoTitle) {
          twitterTitle.setAttribute('content', t.seoTitle);
        }
        
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc && t.seoDesc) {
          twitterDesc.setAttribute('content', t.seoDesc);
        }
      }, [lang, t]);

      useEffect(() => {
        window.scrollTo(0, 0);
        const updateFavicon = () => {
          const favicon = document.querySelector('link[rel="icon"]');
          if (favicon) {
            favicon.href = '/logoJRG.png?v=3';
          }
        };

        const handleGlobalMouse = (e) => {
          setMousePos({ 
            x: (e.clientX / window.innerWidth - 0.5) * 60, 
            y: (e.clientY / window.innerHeight - 0.5) * 60 
          });
        };

        let tickingScroll = false;
        const handleScroll = () => {
          if (!tickingScroll) {
            window.requestAnimationFrame(() => {
              setIsScrolled(window.scrollY > window.innerHeight * 0.4);
              tickingScroll = false;
            });
            tickingScroll = true;
          }
        };

        window.addEventListener('mousemove', handleGlobalMouse);
        window.addEventListener('scroll', handleScroll, { passive: true });
        updateFavicon();

        return () => {
          window.removeEventListener('mousemove', handleGlobalMouse);
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

      const handleSkipBoot = () => {
        setBootProgress(100);
        setBootStage(3);
        setIsBootExiting(true);
        document.body.classList.remove('scroll-locked');
        setTimeout(() => {
          setIsBootDone(true);
        }, 400);
      };

      useEffect(() => {
        document.body.classList.add('is-mobile');
        document.documentElement.classList.add('is-mobile');
        document.body.classList.add('scroll-locked');

        let splineCleanup = null;
        let isCancelled = false;

        const startSpline = () => {
          const host = document.getElementById('spline-mount');
          if (host && !isCancelled) {
            initSplineRobot(host).then((cleanup) => {
              if (isCancelled) {
                if (typeof cleanup === 'function') cleanup();
              } else {
                splineCleanup = cleanup;
              }
            });
          } else if (!isCancelled) {
            setTimeout(startSpline, 60);
          }
        };
        startSpline();

        let current = 0;
        let splineReady = !!window.isSplineRobotReady;

        const onSplineReady = () => {
          splineReady = true;
        };
        window.addEventListener('spline-robot-ready', onSplineReady);

        const startTime = Date.now();
        const minDuration = 2400;

        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const ratio = Math.min(1, elapsed / minDuration);
          let target = ratio * 100;

          if (!splineReady && target > 92) {
            target = 92;
          }
          if (elapsed > 4500) {
            splineReady = true;
          }

          if (current < target) {
            const step = Math.max(1, Math.ceil((target - current) * 0.28));
            current = Math.min(100, current + step);
            setBootProgress(current);

            if (current < 30) setBootStage(0);
            else if (current < 68) setBootStage(1);
            else if (current < 99) setBootStage(2);
            else setBootStage(3);
          }

          if (current >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setIsBootExiting(true);
              document.body.classList.remove('scroll-locked');
              setTimeout(() => {
                setIsBootDone(true);
              }, 700);
            }, 350);
          }
        }, 30);

        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            handleSkipBoot();
          }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
          isCancelled = true;
          clearInterval(timer);
          window.removeEventListener('spline-robot-ready', onSplineReady);
          window.removeEventListener('keydown', handleKeyDown);
          document.body.classList.remove('is-mobile');
          document.documentElement.classList.remove('is-mobile');
          document.body.classList.remove('scroll-locked');
          if (typeof splineCleanup === 'function') {
            splineCleanup();
          }
        };
      }, []);

      useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
      });

      const handleSendEmail = async (e) => {
        e.preventDefault();
        
        // Si no se han configurado credenciales reales
        if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_PUBLIC_KEY')) {
          alert('¡Casi listo!\n\nPara recibir este correo en tu Gmail:\n1. Regístrate en emailjs.com (gratis).\n2. Conecta tu Gmail en "Email Services".\n3. Crea un "Email Template" y configura las variables.\n4. Actualiza la constante EMAILJS_CONFIG en index.html.\n\nPor ahora simulamos el envío de forma exitosa.');
          setStatus('success');
          return;
        }

        setStatus('sending');
        try {
          emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
          await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
            from_email: email,
            message: `La persona con correo ${email} quiere que le hagas una página web.`
          });
          setStatus('success');
          setEmail('');
        } catch (error) {
          console.error('Error al enviar email con EmailJS:', error);
          setStatus('error');
        }
      };

      return (
        <div className="mobile-app-wrapper">
          {/* Animated Background Orbs */}
          <div className="bg-orbs" aria-hidden="true">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
            <div className="orb orb-5"></div>
            <div className="orb orb-6"></div>
          </div>
          <div className="landing">
          
          {/* Minimalist Monochromatic Preloader */}
          {!isBootDone && (
            <div 
              className={`minimal-preloader ${isBootExiting ? 'preloader-exit' : ''}`}
              role="dialog"
              aria-label="Cargando experiencia"
            >
              {/* Fondo en movimiento continuo: degradados negros, grises y blanco */}
              <div className="preloader-bg" aria-hidden="true">
                <div className="preloader-blob blob-1" />
                <div className="preloader-blob blob-2" />
                <div className="preloader-blob blob-3" />
                <div className="preloader-noise" />
              </div>

              {/* Botón sutil de saltar */}
              <button 
                type="button" 
                className="preloader-skip" 
                onClick={handleSkipBoot}
                aria-label="Saltar introducción"
              >
                <span>{t.bootSkip || "Saltar"}</span>
              </button>

              {/* Contenedor central: Logo en el centro y barra progresiva abajo */}
              <div className="preloader-content">
                <div className="preloader-logo-container">
                  <div className="preloader-logo-glow" aria-hidden="true" />
                  <img 
                    src="/logoJRG.png" 
                    alt="Logo JRG" 
                    className="preloader-logo"
                    width="112"
                    height="112"
                  />
                </div>

                {/* Barra progresiva abajo del logo */}
                <div className="preloader-progress-box">
                  <div className="preloader-bar">
                    <div 
                      className="preloader-bar-fill" 
                      style={{ width: `${bootProgress}%` }}
                    />
                  </div>
                  <div className="preloader-details">
                    <span className="preloader-hook">
                      {t.bootHook2 || "Las webs extraordinarias fascinan y convierten."}
                    </span>
                    <span className="preloader-counter">{bootProgress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón Flotante de WhatsApp */}
          <a 
            href="https://wa.me/34613448185" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`whatsapp-float ${isScrolled ? 'is-scrolled' : ''}`}
            aria-label="Contactar por WhatsApp"
          >
            <span className="whatsapp-float-ripple"></span>
            <div className="whatsapp-float-content">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="whatsapp-float-icon">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.767-5.771zm3.374 8.263c-.162.277-.812.543-1.117.58-.27.033-.533.075-.845-.043-.613-.232-1.397-.615-2.072-1.218-.621-.555-1.119-1.21-1.391-1.579-.272-.369-.024-.567.15-.72.156-.138.307-.326.437-.477.108-.124.16-.233.228-.382.067-.149.034-.277-.017-.382-.051-.104-.462-1.12-.633-1.533-.167-.404-.352-.349-.482-.355-.125-.006-.269-.007-.413-.007-.144 0-.379.054-.576.27-.198.217-.756.74-.756 1.802 0 1.063.774 2.09.882 2.238.11.148 1.523 2.324 3.69 3.258.514.222.916.355 1.229.454.517.164.987.141 1.36.085.414-.062 1.272-.519 1.45-1.02.179-.5.179-.928.125-1.02-.054-.09-.198-.144-.413-.253zM12 2C6.477 2 2 6.477 2 12c0 1.885.52 3.654 1.424 5.178L2 22l5.01-1.307C8.423 21.53 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.61 0-3.118-.466-4.402-1.267l-.316-.195-2.98.777.79-2.886-.214-.341C4.015 15.025 3.75 13.565 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/>
              </svg>
              <span className="whatsapp-float-text">{lang === 'es' ? '¿Hablamos?' : 'Let\'s talk?'}</span>
            </div>
          </a>

          {/* Mobile Nav Backdrop */}
          {isNavExpanded && (
            <div
              className="nav-dock-backdrop"
              onClick={() => setIsNavExpanded(false)}
              aria-hidden="true"
            />
          )}

          {/* NAV — Liquid Glass Island */}
          <nav className={`nav-dock ${isNavExpanded ? 'expanded' : ''}`} aria-label="Navegación principal">
            <div className="nav-dock-inner">
              <a href="#" className="nav-dock-brand" aria-label={lang === 'es' ? 'Volver al inicio' : lang === 'eu' ? 'Itzuli hasierara' : 'Back to top'} onClick={() => setIsNavExpanded(false)}>
                <span className="nav-dock-icon" aria-hidden="true">
                  <img src="/logoJRG.png" alt="Logo JRG" className="nav-dock-logo-img" style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: '50%' }} loading="lazy" decoding="async" />
                </span>
              </a>


              <DockLink href="#features" icon="layers" text={t.navServices} onClick={() => setIsNavExpanded(false)} />
              <DockLink href="#work" icon="briefcase" text={t.navWork} onClick={() => setIsNavExpanded(false)} />
              <DockLink href="#contact" icon="mail" text={t.navContact} onClick={() => setIsNavExpanded(false)} />
              
              {/* Premium Language Switcher — Sliding Pill Indicator */}
              <LangSwitcher lang={lang} setLang={setLang} />

              <button 
                className="nav-dock-expand-hint" 
                aria-label="Expandir menú"
                onClick={() => setIsNavExpanded(!isNavExpanded)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              <DockLink href="#contact" icon="arrow-right" text={t.navStart} isCta={true} alwaysExpanded={true} onClick={() => setIsNavExpanded(false)} />
            </div>
          </nav>

          {/* HERO */}
          <header className="hero hero-split">
            <div className="hero-left">

              <div className="hero-available-chip">
                <span className="hero-badge-dot"></span>
                <span className="hero-badge-text">{t.availChip}</span>
              </div>

              <h1 className="hero-title">
                <span className="hero-brand-name">
                  JRG Agency
                </span>
                <span className="sr-only"> - JRG Agency | Mejores creadores de páginas web en el País Vasco, desarrollador web freelance.</span>
              </h1>

              {/* Sparkles Divider Effect */}
              <div className="sparkles-container">
                <div className="sparkles-gradient sparkles-grad-1" />
                <div className="sparkles-gradient sparkles-grad-2" />
                <div className="sparkles-gradient sparkles-grad-3" />
                <Sparkles 
                  minSize={0.4} 
                  maxSize={1.2} 
                  particleDensity={35} 
                  particleColor="#3b82f6" 
                />
              </div>

              <div className="hero-actions">
                <a href="#contact" className="btn-primary btn-primary--wide" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <span>{t.btnTalk}</span>
                  <i data-lucide="arrow-right" className="btn-arrow-icon" style={{ width: 16, height: 16 }}></i>
                </a>
              </div>

              <div className="hero-stats">
                {getStats(lang).map((item) => (
                  <div key={item.label} className="hero-stat glass-chip">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-right">
              <div id="spline-mount" className="hero-canvas-host">
                <div className="spline-fallback flex items-center justify-center">
                  <span className="loader"></span>
                  <span className="spline-loading-text">{t.loading3d}</span>
                </div>
              </div>
            </div>
          </header>

          {/* MY GOOGLE BUSINESS - PRO VERSION (BRAND PALETTE) */}
          <section id="reputation" className="section maps-reputation" style={{ position: 'relative', overflow: 'hidden', zIndex: 5 }}>
            <ContainerScroll
              plainCard={true}
              titleComponent={
                <div className="section-header" style={{ position: 'relative', zIndex: 10, marginBottom: '2rem' }}>
                  <span className="section-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {t.mapsLabel || "Google Business"}
                  </span>
                  <h2>{t.myGoogleTitle}</h2>
                  <p style={{ maxWidth: '650px', margin: '0 auto' }}>{t.myGoogleDesc}</p>
                </div>
              }
            >
              <div className="maps-showcase premium-google-showcase" style={{ 
                background: 'linear-gradient(135deg, var(--navy-dark) 0%, #111315 100%)', 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.06)', 
                boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)', 
                padding: 'clamp(16px, 3.5vw, 28px)', 
                maxWidth: '1080px',
                margin: '0 auto',
                position: 'relative', 
                overflow: 'hidden',
                display: 'block'
              }}>
                {/* Tech grid pattern background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                  opacity: 0.8,
                  pointerEvents: 'none',
                  zIndex: 0,
                  borderRadius: 'inherit'
                }} aria-hidden="true"></div>

                {/* Harmonious Google colors ambient glows (Premium mesh gradient effect adapted to Brand Palette) */}
                <div className="maps-bg-glow" style={{ 
                  background: `
                    radial-gradient(circle at 15% 15%, rgba(var(--navy-rgb), 0.35) 0%, transparent 55%),
                    radial-gradient(circle at 85% 85%, rgba(var(--ash-rgb), 0.12) 0%, transparent 45%),
                    radial-gradient(circle at 80% 20%, rgba(var(--navy-rgb), 0.20) 0%, transparent 50%)
                  `, 
                  opacity: 1, 
                  pointerEvents: 'none', 
                  position: 'absolute', 
                  inset: 0,
                  zIndex: 1,
                  borderRadius: 'inherit'
                }} aria-hidden="true"></div>
                
                <div className="maps-content premium-google-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'stretch', position: 'relative', zIndex: 2, width: '100%' }}>
                  
                  {/* Floating Glass Card (Reviews) */}
                  <div className="maps-visual" style={{ width: '100%', maxWidth: '100%', minHeight: 'auto', position: 'relative', pointerEvents: 'auto', display: 'block', margin: 0, padding: 0 }}>
                    <div className="maps-review-card premium-review-card" style={{ 
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      padding: 'clamp(14px, 3.5vw, 20px)',
                      width: '100%',
                      boxSizing: 'border-box',
                      position: 'relative',
                      top: 0,
                      right: 0,
                      margin: 0,
                      transition: 'transform 0.5s var(--ease-spring), box-shadow 0.5s ease, border-color 0.5s ease'
                    }}>
                      


                      {/* Card Content */}
                      <div className="maps-review-header" style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '0.45rem' }}>
                        {/* Avatar with brand gradient border and Logo */}
                        <div className="avatar-glow-wrap" style={{ position: 'relative', padding: '2px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--navy), var(--ash))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="maps-avatar" style={{ 
                            background: '#0b1017', 
                            width: '48px', 
                            height: '48px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            borderRadius: '50%',
                            overflow: 'hidden',
                            padding: '3px'
                          }}>
                            <img 
                              src="/logoJRG.png" 
                              alt="Logo JRG Agency" 
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain',
                                borderRadius: '50%'
                              }} 
                            />
                          </div>
                        </div>
                        <div className="maps-reviewer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="maps-name" style={{ fontSize: '1.2rem', color: 'var(--white)', fontWeight: '600', letterSpacing: '-0.01em', textAlign: 'center' }}>JRG Agency</span>
                          </div>
                          <span className="maps-time" style={{ color: 'rgba(225, 232, 237, 0.65)', fontSize: '0.82rem', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                            {lang === 'es' ? 'Desarrollador Web Freelance' : lang === 'en' ? 'Freelance Web Developer' : 'Web Garatzaile Freelancea'}
                          </span>
                        </div>
                      </div>

                      {/* Stars Rating */}
                      <div className="maps-stars" style={{ display: 'flex', gap: '5px', marginBottom: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--white)', fontWeight: '800', fontSize: '1.3rem', marginRight: '4px', letterSpacing: '-0.02em' }}>4.7</span>
                        {[1,2,3,4].map(i => (
                          <div key={i} className="star-pulse">
                            <i data-lucide="star" style={{ color: '#FBBC05', fill: '#FBBC05', width: '18px', height: '18px', filter: 'drop-shadow(0 0 8px rgba(251,188,5,0.4))' }}></i>
                          </div>
                        ))}
                        <div className="star-pulse">
                          <i data-lucide="star-half" style={{ color: '#FBBC05', fill: '#FBBC05', width: '18px', height: '18px', filter: 'drop-shadow(0 0 8px rgba(251,188,5,0.4))' }}></i>
                        </div>
                        <span style={{ color: 'rgba(225, 232, 237, 0.55)', fontSize: '0.8rem', marginLeft: '4px' }}>
                          {lang === 'es' ? '(Reseñas verificadas)' : lang === 'en' ? '(Verified reviews)' : '(Iritzi egiaztatuak)'}
                        </span>
                      </div>

                      {/* Testimonial Quote */}
                      <div style={{ position: 'relative', textAlign: 'center' }}>
                        <p className="maps-review-body" style={{ 
                          color: 'rgba(255,255,255,0.9)', 
                          fontSize: '0.94rem', 
                          lineHeight: '1.55', 
                          fontStyle: 'normal',
                          position: 'relative',
                          zIndex: 1,
                          margin: 0,
                          textAlign: 'center'
                        }}>
                          {lang === 'es' 
                            ? '"Increíble nivel de detalle y profesionalidad. La página web vuela, el diseño es espectacular y la comunicación de 10. Totalmente recomendado."'
                            : lang === 'en'
                            ? '"Incredible level of detail and professionalism. The website flies, the design is spectacular and communication was 10/10. Highly recommended."'
                            : '"Xehetasun maila eta profesionaltasun ikaragarria. Webguneak hegan egiten du, diseinua ikusgarria da eta komunikazioa bikaina. Erabat gomendagarria."'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Dashboard Analytics Metrics & CTA */}
                  <div className="maps-stats premium-google-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 10, margin: 0, padding: 0 }}>
                    
                    {/* Premium Grid metrics layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      
                      <div className="premium-metric-card" style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '14px', 
                        padding: '0.9rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <i data-lucide="star" style={{ color: '#FBBC05', width: 18, height: 18, fill: '#FBBC05' }}></i>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(225, 232, 237, 0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Google Rating</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--white)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          4.7 <span style={{ fontSize: '1rem', color: 'rgba(225,232,237,0.4)', fontWeight: '500' }}>/ 5</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(225,232,237,0.6)', marginTop: '4px' }}>
                          {lang === 'es' ? 'Opinión excelente en el sector' : lang === 'en' ? 'Top-rated in the industry' : 'Sektoreko iritzi bikaina'}
                        </div>
                      </div>

                      <div className="premium-metric-card" style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '16px', 
                        padding: '1.25rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <i data-lucide="award" style={{ color: 'var(--ash)', opacity: 0.8, width: 18, height: 18 }}></i>
                          <span style={{ fontSize: '0.82rem', color: 'rgba(225, 232, 237, 0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>SEO Local</span>
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--white)', letterSpacing: '-0.02em' }}>
                          +50
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(225,232,237,0.6)', marginTop: '4px' }}>
                          {lang === 'es' ? 'Palabras clave en el Top 3' : lang === 'en' ? 'Keywords in Top 3' : 'Gako-hitzak Top 3an'}
                        </div>
                      </div>

                      <div className="premium-metric-card" style={{ 
                        gridColumn: '1 / span 2',
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '14px', 
                        padding: '0.85rem 1rem',
                        transition: 'transform 0.3s ease, border-color 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <i data-lucide="phone-call" style={{ color: 'var(--white)', width: 16, height: 16 }}></i>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(225, 232, 237, 0.5)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block' }}>
                              {lang === 'es' ? 'Llamadas & Conversión' : lang === 'en' ? 'Calls & Conversion' : 'Deiak eta Bihurketa'}
                            </span>
                            <div style={{ fontSize: '1.05rem', color: 'var(--white)', fontWeight: '600', marginTop: '2px' }}>
                              {lang === 'es' ? 'Visibilidad directa a llamada directa' : lang === 'en' ? 'Direct visibility to direct call' : 'Ikusgarritasun zuzena deira'}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Google Action Call Button - Matched to Brand primary button styling */}
                    <a href="https://www.google.com/search?sca_esv=0a8c4c9e4d4dd4e5&sxsrf=APpeQnubaBMUE7jGHDvhqfKRAbA-dNJa0A%3A1781998738575&q=JRG%20estudio&stick=H4sIAAAAAAAAAONgU1I1qEg0SzZISTVINE5ONjEyNjG1MqgwMzK3NLIwTUo1MDA2N09OW8TK7RXkrpBaXFKakpkPAAGO6OI3AAAA&mat=CWYuBBgaRwSh&ved=2ahUKEwj47bXO_paVAxXSnycCHSyoEb0QrMcEegQIFxAC" 
                       target="_blank" rel="noopener noreferrer" 
                       className="btn-primary premium-google-btn" 
                       style={{ 
                         display: 'inline-flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         gap: '0.65rem',
                         position: 'relative',
                         zIndex: 99,
                         cursor: 'pointer',
                         textDecoration: 'none',
                         color: '#ffffff',
                         pointerEvents: 'auto',
                         overflow: 'hidden',
                         padding: '11px 20px',
                         minHeight: '44px',
                         fontSize: '0.92rem',
                         width: '100%',
                         boxSizing: 'border-box'
                       }}
                    >
                      <span className="btn-shine-sweep"></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative', zIndex: 2 }}>
                        {t.myGoogleBtn}
                        <i data-lucide="arrow-up-right" className="arrow-icon-shift" style={{ width: 16, height: 16, transition: 'transform 0.3s ease' }}></i>
                      </span>
                    </a>
                    
                    {/* Embedded Style Block */}
                    <style dangerouslySetInnerHTML={{__html: `
                      .premium-review-card:hover {
                        transform: translateY(-2px) scale(1.01);
                        box-shadow: 0 35px 70px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.2) !important;
                        border-color: rgba(255,255,255,0.15) !important;
                      }
                      
                      .premium-metric-card:hover {
                        transform: translateY(-4px);
                        border-color: rgba(var(--navy-rgb), 0.25) !important;
                        background: rgba(255,255,255,0.04) !important;
                      }
                      
                      .live-dot-pulse {
                        width: 8px;
                        height: 8px;
                        background-color: #10B981;
                        border-radius: 50%;
                        display: inline-block;
                        animation: led-blink 1.8s infinite;
                      }
                      
                      .pin-pulse-ring {
                        position: absolute;
                        inset: -6px;
                        border: 2px solid rgba(var(--navy-rgb), 0.4);
                        border-radius: 50%;
                        animation: ring-ripple 2s infinite ease-out;
                      }

                      .premium-google-btn {
                        background: var(--navy);
                        border: 1px solid rgba(255, 255, 255, 0.15);
                        padding: 14px 32px;
                        font-weight: 600;
                        font-size: 1.05rem;
                        transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important;
                      }

                      .premium-google-btn:hover {
                        transform: translateY(-4px);
                        background: var(--navy-dark) !important;
                        border-color: rgba(255, 255, 255, 0.4) !important;
                        box-shadow: 0 15px 40px rgba(var(--navy-rgb), 0.35) !important;
                      }

                      .premium-google-btn:hover .arrow-icon-shift {
                        transform: translate(3px, -3px);
                      }

                      .btn-shine-sweep {
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 50%;
                        height: 100%;
                        background: linear-gradient(
                          to right,
                          rgba(255, 255, 255, 0) 0%,
                          rgba(255, 255, 255, 0.15) 50%,
                          rgba(255, 255, 255, 0) 100%
                        );
                        transform: skewX(-25deg);
                        transition: none;
                        z-index: 1;
                      }

                      .premium-google-btn:hover .btn-shine-sweep {
                        animation: shine-sweep-anim 1.2s ease-out;
                      }

                      @keyframes shine-sweep-anim {
                        100% { left: 150%; }
                      }

                      @keyframes led-blink {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 1; }
                      }

                      @keyframes ring-ripple {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(1.4); opacity: 0; }
                      }
                      
                      .star-pulse {
                        animation: star-glow-pulse 3s infinite ease-in-out;
                      }
                      .star-pulse:nth-child(2) { animation-delay: 0.2s; }
                      .star-pulse:nth-child(3) { animation-delay: 0.4s; }
                      .star-pulse:nth-child(4) { animation-delay: 0.6s; }
                      .star-pulse:nth-child(5) { animation-delay: 0.8s; }
                      
                      @keyframes star-glow-pulse {
                        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(251,188,5,0.2)); }
                        50% { transform: scale(1.08); filter: drop-shadow(0 0 10px rgba(251,188,5,0.6)); }
                      }
                    `}} />
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </section>

          {/* FEATURES */}
          <section id="features" className="section features">
            <ContainerScroll
              plainCard={true}
              titleComponent={
                <div className="section-header">
                  <span className="section-label">{t.services}</span>
                  <h2 className="section-title">{t.servicesTitle}</h2>
                  <p>{t.servicesDesc}</p>
                </div>
              }
            >
              <div style={{ width: '100%', marginTop: '10px' }}>
                <InteractiveFeatures lang={lang} />
              </div>
            </ContainerScroll>
          </section>

          {/* WORK */}
          <section id="work" className="section showcase">
            <ContainerScroll
              titleComponent={
                <div className="showcase-copy">
                  <span className="section-label">{t.portfolio}</span>
                  <h2>{t.portfolioTitle}</h2>
                  <p>{t.portfolioDesc}</p>
                </div>
              }
            >
              <ShowcasePipeline lang={lang} />
            </ContainerScroll>
          </section>

          {/* PORTFOLIO GRID */}
          <section id="portfolio-grid" className="section features">
            <ContainerScroll
              plainCard={true}
              titleComponent={
                <div className="section-header">
                  <span className="section-label">
                    <i data-lucide="layout-template" style={{ width: 14, height: 14, marginRight: 6 }}></i>
                    {lang === 'es' ? 'Proyectos Web' : lang === 'en' ? 'Web Projects' : 'Web Proiektuak'}
                  </span>
                  <h2>{lang === 'es' ? 'Portfolio de páginas web' : lang === 'en' ? 'Web pages portfolio' : 'Webguneen portfolioa'}</h2>
                  <p>{lang === 'es' ? 'Descubre nuestros últimos proyectos web, diseñados con atención al detalle, alto rendimiento y enfoque en resultados.' : lang === 'en' ? 'Discover our latest web projects, designed with attention to detail, high performance, and a focus on results.' : 'Ezagutu gure azken web proiektuak, xehetasunei arreta jarriz, errendimendu altuarekin eta emaitzetan zentratuz.'}</p>
                </div>
              }
            >
              <div className="portfolio-grid">
                {getPortfolioProjects(lang).map((p) => (
                  <PortfolioCard key={p.id} project={p} lang={lang} />
                ))}
              </div>
            </ContainerScroll>
          </section>

          {/* CTA - Premium Full-Width Dark Section */}
          <section id="contact" className="cta-section" style={{ position: 'relative' }}>

            {/* Animated background orbs */}
            <div className="cta-bg-orbs" aria-hidden="true" style={{ zIndex: 0 }}>
              <div className="cta-bg-orb cta-bg-orb-1"></div>
              <div className="cta-bg-orb cta-bg-orb-2"></div>
              <div className="cta-bg-orb cta-bg-orb-3"></div>
            </div>

            {/* Subtle grid pattern */}
            <div className="cta-grid-pattern" aria-hidden="true"></div>

            <div className="cta-inner cta-inner-custom" style={{ 
              position: 'relative', 
              zIndex: 2, 
              margin: '0 auto',
              maxWidth: '1050px',
              padding: '0 clamp(16px, 4vw, 32px)'
            }}>
              
              {/* Left: Copy */}
              <div className="cta-copy" style={{ 
                position: 'relative', 
                zIndex: 1
              }}>
                <span className="cta-badge">
                  <i data-lucide="zap" style={{ width: 13, height: 13 }}></i>
                  {t.ctaBadge}
                </span>
                <h2 className="cta-title">
                  <span className="cta-title-line">{t.ctaTitleLine}</span>
                  <span className="cta-title-gradient">{t.ctaTitleGrad}</span>
                </h2>
                <p className="cta-desc">
                  {t.ctaDesc}
                </p>
                <div className="cta-trust-chips">
                  <div className="cta-trust-chip">
                    <i data-lucide="shield-check" style={{ width: 15, height: 15 }}></i>
                    <span>{t.ctaTrust1}</span>
                  </div>
                  <div className="cta-trust-chip">
                    <i data-lucide="clock" style={{ width: 15, height: 15 }}></i>
                    <span>{t.ctaTrust2}</span>
                  </div>
                  <div className="cta-trust-chip">
                    <i data-lucide="sparkles" style={{ width: 15, height: 15 }}></i>
                    <span>{t.ctaTrust3}</span>
                  </div>
                </div>
              </div>

              {/* Right: Form Card */}
              <div className="cta-form-card" style={{ position: 'relative', zIndex: 1 }}>
                <div className="cta-form-card-shine" aria-hidden="true"></div>
                <div className="cta-form-header">
                  <div className="cta-form-icon">
                    <i data-lucide="send" style={{ width: 22, height: 22 }}></i>
                  </div>
                  <h3 className="cta-form-title">{t.ctaFormTitle}</h3>
                  <p className="cta-form-subtitle">{t.ctaFormSubtitle}</p>
                </div>

                {status === 'success' ? (
                  <div className="cta-success">
                    <div className="cta-success-icon">
                      <i data-lucide="check" style={{ width: 28, height: 28 }}></i>
                    </div>
                    <h4 className="cta-success-title">{t.ctaSuccessTitle}</h4>
                    <p className="cta-success-text">{t.ctaSuccessText}</p>
                    <button onClick={() => setStatus('idle')} className="cta-btn-retry">
                      <i data-lucide="refresh-cw" style={{ width: 14, height: 14 }}></i>
                      {t.ctaRetry}
                    </button>
                  </div>
                ) : (
                  <form className="cta-form-new" onSubmit={handleSendEmail}>
                    <div className="cta-input-wrap">
                      <i data-lucide="mail" className="cta-input-icon" style={{ width: 18, height: 18 }}></i>
                      <input 
                        type="email" 
                        placeholder="tu@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'sending'}
                        className="cta-input"
                        aria-label={t.ctaFormSubtitle}
                      />
                    </div>
                    <button type="submit" className="cta-submit-btn" disabled={status === 'sending'}>
                      {status === 'sending' ? (
                        <React.Fragment>
                          <span className="cta-submit-loader"></span>
                          {t.ctaSending}
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          {t.ctaSubmit}
                          <i data-lucide="arrow-right" style={{ width: 18, height: 18 }}></i>
                        </React.Fragment>
                      )}
                    </button>
                  </form>
                )}

                {status === 'error' && (
                  <div className="cta-error">
                    <i data-lucide="alert-circle" style={{ width: 16, height: 16 }}></i>
                    Error al enviar. Inténtalo de nuevo.
                  </div>
                )}

                <div className="cta-form-divider">
                  <span>{t.ctaOr}</span>
                </div>

                <a href="https://wa.me/34613448185" target="_blank" rel="noopener noreferrer" className="cta-whatsapp-alt">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="cta-wa-icon">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.767-5.771zm3.374 8.263c-.162.277-.812.543-1.117.58-.27.033-.533.075-.845-.043-.613-.232-1.397-.615-2.072-1.218-.621-.555-1.119-1.21-1.391-1.579-.272-.369-.024-.567.15-.72.156-.138.307-.326.437-.477.108-.124.16-.233.228-.382.067-.149.034-.277-.017-.382-.051-.104-.462-1.12-.633-1.533-.167-.404-.352-.349-.482-.355-.125-.006-.269-.007-.413-.007-.144 0-.379.054-.576.27-.198.217-.756.74-.756 1.802 0 1.063.774 2.09.882 2.238.11.148 1.523 2.324 3.69 3.258.514.222.916.355 1.229.454.517.164.987.141 1.36.085.414-.062 1.272-.519 1.45-1.02.179-.5.179-.928.125-1.02-.054-.09-.198-.144-.413-.253zM12 2C6.477 2 2 6.477 2 12c0 1.885.52 3.654 1.424 5.178L2 22l5.01-1.307C8.423 21.53 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.61 0-3.118-.466-4.402-1.267l-.316-.195-2.98.777.79-2.886-.214-.341C4.015 15.025 3.75 13.565 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/>
                  </svg>
                  {t.ctaWa}
                  <i data-lucide="external-link" style={{ width: 14, height: 14 }}></i>
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER — PREMIUM DARK EXPERIENCE */}
          <footer className="footer-epic" style={{ position: 'relative' }}>

            {/* Animated background effects */}
            <div className="footer-aurora" aria-hidden="true"></div>
            <div className="footer-grid-overlay" aria-hidden="true"></div>
            <div className="footer-orbs" aria-hidden="true">
              <div className="footer-orb footer-orb-1"></div>
              <div className="footer-orb footer-orb-2"></div>
              <div className="footer-orb footer-orb-3"></div>
            </div>

            {/* Animated top border */}
            <div className="footer-top-glow" aria-hidden="true"></div>

            {/* Main content grid */}
            <div className="footer-main-grid">
              {/* Brand column */}
              <div className="footer-brand-epic">
                <div className="footer-logo-epic">
                  <div className="footer-logo-icon-wrap">
                    <img src="/logoJRG.png" alt="Logo JRG" className="footer-logo-icon-img" loading="lazy" decoding="async" />
                  </div>
                  <span className="footer-logo-name">JRG Agency</span>
                </div>
                <p className="footer-brand-desc">
                  {t.footerDesc}
                </p>
                <div className="footer-avail-chip">
                  <span className="footer-avail-dot"></span>
                  <span>{t.footerAvail}</span>
                </div>
              </div>

              {/* Nav column */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">{t.footerExplore}</h4>
                <ul className="footer-link-list">
                  <li><a href="#features" className="footer-link-epic"><i data-lucide="layers" style={{ width: 15, height: 15 }}></i><span>{t.navServices}</span><i data-lucide="arrow-up-right" style={{ width: 12, height: 12 }} className="footer-link-arrow"></i></a></li>
                  <li><a href="#work" className="footer-link-epic"><i data-lucide="briefcase" style={{ width: 15, height: 15 }}></i><span>{t.navWork}</span><i data-lucide="arrow-up-right" style={{ width: 12, height: 12 }} className="footer-link-arrow"></i></a></li>
                  <li><a href="#contact" className="footer-link-epic"><i data-lucide="mail" style={{ width: 15, height: 15 }}></i><span>{t.navContact}</span><i data-lucide="arrow-up-right" style={{ width: 12, height: 12 }} className="footer-link-arrow"></i></a></li>
                </ul>
              </div>

              {/* Social column */}
              <div className="footer-links-col">
                <h4 className="footer-col-title">{t.footerConnect}</h4>
                <div className="footer-social-cards">

                  <a href="https://wa.me/34613448185" target="_blank" rel="noopener noreferrer" className="footer-social-card" style={{'--social-accent': '#25d366', '--social-accent-rgb': '37,211,102'}}>
                    <div className="footer-social-card-glow" aria-hidden="true"></div>
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, fill: 'currentColor' }}><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.185-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.767-5.771zm3.374 8.263c-.162.277-.812.543-1.117.58-.27.033-.533.075-.845-.043-.613-.232-1.397-.615-2.072-1.218-.621-.555-1.119-1.21-1.391-1.579-.272-.369-.024-.567.15-.72.156-.138.307-.326.437-.477.108-.124.16-.233.228-.382.067-.149.034-.277-.017-.382-.051-.104-.462-1.12-.633-1.533-.167-.404-.352-.349-.482-.355-.125-.006-.269-.007-.413-.007-.144 0-.379.054-.576.27-.198.217-.756.74-.756 1.802 0 1.063.774 2.09.882 2.238.11.148 1.523 2.324 3.69 3.258.514.222.916.355 1.229.454.517.164.987.141 1.36.085.414-.062 1.272-.519 1.45-1.02.179-.5.179-.928.125-1.02-.054-.09-.198-.144-.413-.253zM12 2C6.477 2 2 6.477 2 12c0 1.885.52 3.654 1.424 5.178L2 22l5.01-1.307C8.423 21.53 10.15 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.61 0-3.118-.466-4.402-1.267l-.316-.195-2.98.777.79-2.886-.214-.341C4.015 15.025 3.75 13.565 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/></svg>
                    <span>WhatsApp</span>
                  </a>

                  <a href="mailto:jakessrodriguezz@gmail.com" className="footer-social-card" style={{'--social-accent': '#a78bfa', '--social-accent-rgb': '167,139,250'}}>
                    <div className="footer-social-card-glow" aria-hidden="true"></div>
                    <i data-lucide="mail" style={{ width: 20, height: 20 }}></i>
                    <span>Email</span>
                  </a>

                  <a href="https://github.com/jakesrodriguez" target="_blank" rel="noopener noreferrer" className="footer-social-card" style={{'--social-accent': '#e2e8f0', '--social-accent-rgb': '226,232,240'}}>
                    <div className="footer-social-card-glow" aria-hidden="true"></div>
                    <i data-lucide="github" style={{ width: 20, height: 20 }}></i>
                    <span>GitHub</span>
                  </a>

                  <a href="https://linkedin.com/in/jakesrodriguez" target="_blank" rel="noopener noreferrer" className="footer-social-card" style={{'--social-accent': '#0ea5e9', '--social-accent-rgb': '14,165,233'}}>
                    <div className="footer-social-card-glow" aria-hidden="true"></div>
                    <i data-lucide="linkedin" style={{ width: 20, height: 20 }}></i>
                    <span>LinkedIn</span>
                  </a>

                </div>
              </div>
            </div>

            {/* Marquee ticker */}
            <div className="footer-marquee-wrap" aria-hidden="true">
              <div className="footer-marquee">
                <span className="footer-marquee-text">DISEÑO INMERSIVO</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">DESARROLLO MODERNO</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">EXPERIENCIAS 3D</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">WEBGL & REACT</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">MOTION DESIGN</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">DISEÑO INMERSIVO</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">DESARROLLO MODERNO</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">EXPERIENCIAS 3D</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">WEBGL & REACT</span>
                <span className="footer-marquee-dot">◆</span>
                <span className="footer-marquee-text">MOTION DESIGN</span>
                <span className="footer-marquee-dot">◆</span>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom-epic">
              <p className="footer-copyright-epic">
                © {new Date().getFullYear()} JRG Agency
                <span className="footer-copyright-sep">·</span>
                <span className="footer-copyright-tech">React + Spline + CSS Premium</span>
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="footer-btt-epic"
                aria-label={t.btt}
              >
                <span className="footer-btt-line" aria-hidden="true"></span>
                <span className="footer-btt-content">
                  <span>{t.btt}</span>
                  <i data-lucide="arrow-up" style={{ width: 16, height: 16 }}></i>
                </span>
              </button>
            </div>
          </footer>
          
          {/* Rotating Text Ring */}
          <div className="rotating-text-ring" aria-hidden="true">
            <svg viewBox="0 0 200 200" width="120" height="120">
              <path id="textPath" d="M 100, 100 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" fill="none" />
              <text>
                <textPath href="#textPath" startOffset="0">
                  OPEN TO WORK • SCROLL DOWN • LET'S TALK • 
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    );
    }

export default LandingPage;


