// Vercel Serverless Function: Asistente Legal y de Privacidad con Google Gemini API
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, lang = "es" } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  const systemPrompt = `Eres el Asistente Oficial de Privacidad y Cumplimiento Legal de JRG Agency (estudio de desarrollo web e IA fundado por Jakes Rodriguez en Urretxu, Gipuzkoa).
Tus conocimientos están basados en el marco legal español y europeo:
- RGPD (Reglamento UE 2016/679) y LOPDGDD (Ley Orgánica 3/2018).
- LSSI-CE (Ley 34/2002) y Guía de Cookies de la AEPD.
- Ley 11/2023 de Accesibilidad.
- TRLGDCU (RDL 1/2007) y derecho de desistimiento en proyectos a medida.

Normas de conducta:
1. Sé conciso, profesional, empático y directo (máximo 2 párrafos breves).
2. Explica con total transparencia que JRG Agency solo recopila datos identificativos (nombre, email, teléfono) facilitados voluntariamente al consultar presupuestos de desarrollo web o IA, y métricas anónimas agregadas si el usuario acepta las cookies analíticas.
3. Si el usuario desea ejercer sus derechos ARSOPOL (Acceso, Rectificación, Supresión/Borrado, Oposición, Portabilidad), indícale que puede hacerlo escribiendo a jakessrodriguezz@gmail.com o usando el botón de correo pre-redactado.
4. Responde con precisión en el idioma solicitado (${lang}: es = castellano, eu = euskera, en = inglés).`;

  // Si existe clave de Gemini, invocamos el modelo oficial de Google
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\nConsulta del usuario:\n${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({
          reply: data.candidates[0].content.parts[0].text.trim(),
          source: "gemini-api",
        });
      }
    } catch (err) {
      console.warn("Fallo en Gemini API, utilizando fallback local:", err);
    }
  }

  // Fallback inteligente contextual si no hay clave API configurada aún en Vercel
  const query = message.toLowerCase();
  let fallbackReply = "";

  if (lang === "eu") {
    if (query.includes("ezabatu") || query.includes("borrar") || query.includes("ezabatzea")) {
      fallbackReply = "Zure datuak ezabatzeko eskubidea (DBEO 17. artikulua) edozein unetan erabil dezakezu. Zure eskaera izapidetzeko, bidali mezu bat jakessrodriguezz@gmail.com helbidera edo erabili beheko botoia zirriborro automatiko bat irekitzeko.";
    } else if (query.includes("cookie") || query.includes("kuki")) {
      fallbackReply = "Gure webgunean oinarrizko nabigaziorako beharrezkoak diren cookie teknikoak eta Vercel bidezko neurketa analitiko anonimoak erabiltzen ditugu. Beheko 'Ajustes de cookies' botoian edozein momentutan desaktiba ditzakezu.";
    } else {
      fallbackReply = "JRG Agency-n gardentasun osoz jokatzen dugu: soilik aurrekontuak eskatzerakoan borondatez emandako kontaktu-datuak (izena, posta elektronikoa eta telefonoa) kudeatzen ditugu. Edozein eskaera jakessrodriguezz@gmail.com bidez egin dezakezu.";
    }
  } else if (lang === "en") {
    if (query.includes("delete") || query.includes("erase") || query.includes("remove")) {
      fallbackReply = "You can exercise your right to erasure (GDPR Article 17) at any time. Simply email jakessrodriguezz@gmail.com with your request or click the button below to generate a pre-filled deletion email.";
    } else if (query.includes("cookie")) {
      fallbackReply = "We only use essential cookies for website operation and anonymous performance metrics via Vercel. You can modify or revoke your consent anytime using the 'Cookie settings' button.";
    } else {
      fallbackReply = "JRG Agency only processes contact data you voluntarily provide when inquiring about projects (name, email, phone) and aggregated anonymous metrics. Reach out directly at jakessrodriguezz@gmail.com for any privacy query.";
    }
  } else {
    if (query.includes("borrar") || query.includes("eliminar") || query.includes("supres")) {
      fallbackReply = "Puedes ejercer tu derecho de supresión (Art. 17 RGPD) en cualquier momento. Para tramitar la baja y borrado de cualquier dato tuyo, escríbenos a jakessrodriguezz@gmail.com o pulsa el botón inferior para abrir un email redactado automáticamente.";
    } else if (query.includes("cookie") || query.includes("rastreo")) {
      fallbackReply = "Utilizamos únicamente cookies técnicas indispensables para la navegación y métricas anónimas de rendimiento mediante Vercel Analytics. Puedes revocar o cambiar tu decisión en cualquier momento pulsando en 'Ajustes de cookies'.";
    } else {
      fallbackReply = "En JRG Agency tratamos tus datos personales (nombre, email y teléfono) exclusivamente para atender consultas y presupuestos de desarrollo web. No cedemos datos a terceros. Puedes consultar todos los detalles en nuestra Política de Privacidad o escribir a jakessrodriguezz@gmail.com.";
    }
  }

  return res.status(200).json({
    reply: fallbackReply,
    source: "fallback-engine",
  });
}
