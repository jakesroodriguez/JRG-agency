"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { WebSocketServer } = require("ws");

const ADAPTER_PORT = parseInt(process.env.JRG_ADAPTER_PORT || process.env.DEMO_ADAPTER_PORT || "18789", 10);
const MAIN_KEY = "main";

// Intento de cargar la API key de Gemini o OpenAI de .env si existe
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const MODELS = [
  { id: "gemini-2.5-flash", name: "Google Gemini 2.5 Flash", provider: "google" },
  { id: "gemini-1.5-flash", name: "Google Gemini 1.5 Flash", provider: "google" },
  { id: "jrg/agency-engine", name: "JRG Agency Local Engine", provider: "jrg" },
];

// Carga de la base de leads de JRG Agency
let priorityLeads = [];
try {
  const sprintLeadsPath = path.resolve(__dirname, "../../3-Leads/02_📊_Bases_Datos_Leads/sprint_30_leads_prioritarios.json");
  if (fs.existsSync(sprintLeadsPath)) {
    const raw = fs.readFileSync(sprintLeadsPath, "utf8");
    priorityLeads = JSON.parse(raw);
    console.log(`[JRG Gateway] Cargados ${priorityLeads.length} leads prioritarios desde 3-Leads.`);
  }
} catch (e) {
  console.warn("[JRG Gateway] No se pudo leer sprint_30_leads_prioritarios.json, usando catálogo interno.");
}

if (!priorityLeads.length) {
  priorityLeads = [
    {
      id: 640,
      nombre: "Restaurante Ezkiotarra",
      municipio: "Zumarraga",
      categoria: "Restaurante",
      telefono: "943 72 29 64",
      reviews: 331,
      rating: 4.4,
      website_actual: "",
      mensaje_whatsapp: "Kaixo Restaurante Ezkiotarra! Soy Jakes de JRG Agency en Urretxu. He visto vuestras excelentes reseñas pero no tenéis carta interactiva ni web para móvil. Os he preparado un prototipo rápido: https://jrgagency.eus/demo/ezkiotarra",
      slug: "restaurante-ezkiotarra-zumarraga",
    },
    {
      id: 32,
      nombre: "Bar Oilarra",
      municipio: "Legazpi",
      categoria: "Bar",
      telefono: "605 76 49 16",
      reviews: 291,
      rating: 4.5,
      website_actual: "",
      mensaje_whatsapp: "Kaixo Bar Oilarra! Soy Jakes de JRG Agency. Vuestra puntuación en Google es top, pero falta carta móvil y reservas online. Revisad esta demo que os preparamos en 48h.",
      slug: "bar-oilarra-legazpi",
    },
    {
      id: 54,
      nombre: "Estanko Laubide",
      municipio: "Legazpi",
      categoria: "Estanco",
      telefono: "943 73 12 49",
      reviews: 574,
      rating: 4.4,
      website_actual: "https://www.nire-legazpi.eus/empresa/estanko-laubide",
      mensaje_whatsapp: "Kaixo Estanko Laubide! Vuestras valoraciones son increíbles (574 reviews). Podemos montar vuestra web moderna y catálogo interactivo en 48h por 400€.",
      slug: "estanko-laubide-legazpi",
    },
  ];
}

// Equipo de Agentes Oficial de JRG Agency
const initialAgentsList = [
  {
    id: "jrg-director",
    name: "Aitor (Director)",
    role: "Orchestrator",
    workspace: "/jrg/director",
    avatarRole: "Director de Operaciones",
    emoji: "⚡",
    bio: "Coordinador general del equipo de agentes de JRG Agency. Desglosa objetivos, asigna tareas y supervisa el pipeline comercial y técnico.",
  },
  {
    id: "jrg-hunter",
    name: "Maider (Leads)",
    role: "Lead Scout",
    workspace: "/jrg/hunter",
    avatarRole: "Scout de Leads & Prospección",
    emoji: "🎯",
    bio: "Audita comercios de Goierri, Gipuzkoa y España. Conectada a la base de 2.400+ comercios para detectar falta de web o menú digital.",
  },
  {
    id: "jrg-copywriter",
    name: "Iker (Ventas)",
    role: "Sales Pitch",
    workspace: "/jrg/copywriter",
    avatarRole: "Ventas & WhatsApp Outreach",
    emoji: "💬",
    bio: "Redactor de pitches persuasivos de WhatsApp, guiones de llamadas y propuestas comerciales de digitalización e IA para clientes.",
  },
  {
    id: "jrg-architect",
    name: "Unai (Web & 3D)",
    role: "Builder",
    workspace: "/jrg/architect",
    avatarRole: "Arquitecto Web & Demos IA",
    emoji: "💻",
    bio: "Generador de demos, prototipos web con diseño Liquid Glass, cartas digitales interactivas en 3D/NFC y prototipos de chatbots.",
  },
  {
    id: "jrg-deployer",
    name: "Elena (Delivery)",
    role: "Client Delivery",
    workspace: "/jrg/deployer",
    avatarRole: "Despliegue & Delivery Clientes",
    emoji: "🚀",
    bio: "Empaqueta y entrega agentes de atención automática y reservas por WhatsApp para los clientes de hostelería y PYMEs de JRG Agency.",
  },
];

const agents = new Map(initialAgentsList.map((a) => [a.id, a]));
const files = new Map();
const sessionSettings = new Map();
const conversationHistory = new Map();
const activeRuns = new Map();
const activeSendEventFns = new Set();

// Tablero Kanban de JRG Agency
const tasks = new Map([
  [
    "kanban:task-1",
    {
      id: "kanban:task-1",
      title: "Auditoría de comercios en Goierri sin web",
      description: "Analizar los 30 primeros comercios de Zumarraga y Legazpi con más de 100 reseñas y sin página web.",
      status: "done",
      source: "hermes_event",
      assignedAgentId: "jrg-hunter",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      notes: ["30 leads cualificados y ordenados por potencial."],
      isArchived: false,
    },
  ],
  [
    "kanban:task-2",
    {
      id: "kanban:task-2",
      title: "Generación de pitches de WhatsApp (Sprint 30)",
      description: "Redactar mensajes personalizados para Restaurante Ezkiotarra, Bar Oilarra y Urzubi Taberna.",
      status: "working",
      source: "hermes_event",
      assignedAgentId: "jrg-copywriter",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ["Pitches personalizados creados con enlaces a demo."],
      isArchived: false,
    },
  ],
  [
    "kanban:task-3",
    {
      id: "kanban:task-3",
      title: "Demo 3D & NFC para Restaurante Ezkiotarra",
      description: "Preparar visor interactivo de carta digital 3D para enseñar al propietario en la propuesta.",
      status: "working",
      source: "hermes_event",
      assignedAgentId: "jrg-architect",
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ["Integrar con soporte NFC de mesa y diseño Liquid Glass."],
      isArchived: false,
    },
  ],
  [
    "kanban:task-4",
    {
      id: "kanban:task-4",
      title: "Configurar agente de reservas WhatsApp (Piloto)",
      description: "Empaquetar asistente de IA para gestión automática de mesas y horarios en restaurante.",
      status: "scheduled",
      source: "playbook",
      assignedAgentId: "jrg-deployer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ["Conectar con webhook de WhatsApp Cloud API."],
      isArchived: false,
    },
  ],
  [
    "kanban:task-5",
    {
      id: "kanban:task-5",
      title: "Reunión de Standup y Estrategia de Cierre",
      description: "Sincronización semanal del equipo de agentes para revisar tasa de respuesta en WhatsApp.",
      status: "inbox",
      source: "hermes_event",
      assignedAgentId: "jrg-director",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: ["Evaluar métricas y volumen de leads en Goierri y Alto Urola."],
      isArchived: false,
    },
  ],
]);

function randomId() {
  return randomUUID().replace(/-/g, "");
}

function sessionKeyFor(agentId) {
  return `agent:${agentId}:${MAIN_KEY}`;
}

function getHistory(sessionKey) {
  if (!conversationHistory.has(sessionKey)) {
    conversationHistory.set(sessionKey, []);
  }
  return conversationHistory.get(sessionKey);
}

function clearHistory(sessionKey) {
  conversationHistory.delete(sessionKey);
}

function resOk(id, payload) {
  return { type: "res", id, ok: true, payload: payload ?? {} };
}

function resErr(id, code, message) {
  return { type: "res", id, ok: false, error: { code, message } };
}

function broadcastEvent(frame) {
  for (const send of activeSendEventFns) {
    try {
      send(frame);
    } catch {}
  }
}

function agentListPayload() {
  return [...agents.values()].map((agent) => ({
    id: agent.id,
    name: agent.name,
    workspace: agent.workspace,
    identity: { name: agent.name, emoji: agent.emoji || "🤖" },
    role: agent.role,
    bio: agent.bio,
  }));
}

// Llamada inteligente con Gemini API si hay API key configurada
async function callGeminiStream(agent, message, history, onChunk) {
  if (!GEMINI_API_KEY) return null;

  try {
    const systemInstruction = `Eres ${agent.name}, ${agent.role} en JRG Agency (https://jrgagency.eus).
JRG Agency es una agencia de inteligencia artificial, automatizaciones, desarrollo web moderno y chatbots para empresas y restaurantes, con sede en Gipuzkoa y alcance en toda España.
Tu tono es directo, profesional, ejecutivo y tecnológico.
Responde de forma concisa y útil para el usuario.`;

    const contents = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }],
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
      }),
    });

    if (!response.ok) {
      console.warn(`[JRG Gateway] Gemini API HTTP error: ${response.status}`);
      return null;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6).trim();
          if (jsonStr) {
            try {
              const parsed = JSON.parse(jsonStr);
              const textPiece = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textPiece) {
                fullText += textPiece;
                onChunk(textPiece);
              }
            } catch {}
          }
        }
      }
    }

    return fullText;
  } catch (err) {
    console.warn("[JRG Gateway] Error calling Gemini API:", err.message);
    return null;
  }
}

// Respuestas simuladas de alta fidelidad basadas en el contexto real de JRG Agency
function buildJRGReply(agent, message) {
  const norm = message.toLowerCase().trim();

  if (agent.id === "jrg-hunter" || agent.role.includes("Scout")) {
    if (norm.includes("lead") || norm.includes("restaurante") || norm.includes("zumarraga") || norm.includes("legazpi")) {
      const lead1 = priorityLeads[0];
      const lead2 = priorityLeads[1];
      return `🎯 **Informe de Prospección — JRG Agency**:
He filtrado los leads prioritarios de la base de datos de Goierri/Alto Urola:
1. **${lead1.nombre}** (${lead1.municipio}): ${lead1.reviews} reviews en Google (★${lead1.rating}), sin web optimizada.
2. **${lead2.nombre}** (${lead2.municipio}): ${lead2.reviews} reviews (★${lead2.rating}), sin carta digital móvil.

He enviado la notificación a Iker (Ventas) para que genere los mensajes de WhatsApp personalizados.`;
    }
    return `🎯 **Maider al habla**. Tengo indexados más de 2.400 comercios en Goierri, Alto Urola y resto de España. Indícame qué sector o municipio quieres auditar y te extraigo los candidatos con mayor potencial de digitalización.`;
  }

  if (agent.id === "jrg-copywriter" || agent.role.includes("Sales")) {
    if (norm.includes("pitch") || norm.includes("whatsapp") || norm.includes("mensaje")) {
      const lead = priorityLeads[0];
      return `💬 **Propuesta de WhatsApp para ${lead.nombre}**:
"Kaixo ${lead.nombre}! Soy Jakes de JRG Agency aquí en Urretxu.
He visto vuestras ${lead.reviews} buenas valoraciones en Google, pero no tenéis web para ver la carta o reservar desde el móvil.
Os he preparado un boceto rápido de cómo quedaría en el móvil:
👉 ${lead.demo_url || "https://jrgagency.eus/demo/ezkiotarra"}
La dejamos lista en 48h por 400€ (y 19€/mes mantenimiento).
¿Qué os parece el diseño?"

¿Quieres que lo programe en la cabina de salida para enviar?`;
    }
    return `💬 **Iker aquí**. Especialista en conversión outbound de JRG Agency. Puedo redactar guiones de llamada, secuencias de WhatsApp para hostelería o propuestas de automatización con IA.`;
  }

  if (agent.id === "jrg-architect" || agent.role.includes("Builder")) {
    return `💻 **Unai en el Lab de Desarrollo**.
Estamos diseñando la arquitectura de demos con React 19, Three.js y soporte para cartas físicas NFC 3D como las que mostramos en la web principal.
Si el cliente necesita un chatbot o una web Liquid Glass en 48h, tengo el scaffold listo para compilar.`;
  }

  if (agent.id === "jrg-deployer" || agent.role.includes("Delivery")) {
    return `🚀 **Elena en Despliegue de Clientes**.
Tengo los conectores listos para empaquetar agentes de reservas automáticas por WhatsApp Cloud API y asistentes de soporte 24/7. Listos para instalar en producción en cuanto Iker cierre el acuerdo.`;
  }

  // Director / Orquestador por defecto
  return `⚡ **Aitor — Director de Operaciones JRG Agency**:
Equipo sincronizado. Tareas activas en el Kanban:
- Prospección de restaurantes en Goierri: en marcha con Maider.
- Campaña de WhatsApp y llamadas frías: gestionada por Iker.
- Demos interactivas 3D y Web: en desarrollo con Unai.
- Despliegue a clientes: preparado con Elena.

¿Qué nuevo objetivo o cliente quieres coordinar hoy?`;
}

async function handleMethod(method, params, id, sendEvent) {
  const p = params || {};

  switch (method) {
    case "agents.list":
      return resOk(id, { defaultId: "jrg-director", mainKey: MAIN_KEY, agents: agentListPayload() });

    case "agents.create": {
      const name = typeof p.name === "string" && p.name.trim() ? p.name.trim() : "Nuevo Agente JRG";
      const role = typeof p.role === "string" ? p.role.trim() : "Especialista";
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "jrg-agent";
      const agentId = `${slug}-${randomId().slice(0, 6)}`;
      agents.set(agentId, {
        id: agentId,
        name,
        role,
        workspace: `/jrg/${slug}`,
        emoji: "🤖",
        bio: `Agente creado en JRG Agency para tareas de ${role}.`,
      });
      broadcastEvent({
        type: "event",
        event: "presence",
        payload: { sessions: { recent: [], byAgent: [] } },
      });
      return resOk(id, { agentId, name, workspace: `/jrg/${slug}` });
    }

    case "agents.update": {
      const agentId = typeof p.agentId === "string" ? p.agentId.trim() : "";
      const agent = agents.get(agentId);
      if (!agent) return resErr(id, "not_found", `Agent ${agentId} not found`);
      if (typeof p.name === "string" && p.name.trim()) agent.name = p.name.trim();
      if (typeof p.role === "string") agent.role = p.role.trim();
      return resOk(id, { ok: true, removedBindings: 0 });
    }

    case "agents.delete": {
      const agentId = typeof p.agentId === "string" ? p.agentId.trim() : "";
      if (agentId && agents.has(agentId) && agentId !== "jrg-director") {
        agents.delete(agentId);
        clearHistory(sessionKeyFor(agentId));
      }
      return resOk(id, { ok: true, removedBindings: 0 });
    }

    case "agents.files.get": {
      const key = `${p.agentId || "jrg-director"}/${p.name || ""}`;
      const content = files.get(key);
      return resOk(id, { file: content !== undefined ? { content } : { missing: true } });
    }

    case "agents.files.set": {
      const key = `${p.agentId || "jrg-director"}/${p.name || ""}`;
      files.set(key, typeof p.content === "string" ? p.content : "");
      return resOk(id, {});
    }

    // Tareas / Kanban
    case "tasks.list": {
      return resOk(id, { tasks: [...tasks.values()] });
    }

    case "tasks.create": {
      const taskId = `kanban:task-${randomId().slice(0, 8)}`;
      const task = {
        id: taskId,
        title: p.title || "Nueva Tarea JRG",
        description: p.description || "",
        status: p.status || "inbox",
        source: p.source || "hermes3d_manual",
        assignedAgentId: p.assignedAgentId || "jrg-director",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: p.notes || [],
        isArchived: false,
      };
      tasks.set(taskId, task);
      return resOk(id, task);
    }

    case "tasks.update": {
      const taskId = p.id;
      const task = tasks.get(taskId);
      if (!task) return resErr(id, "not_found", `Task ${taskId} not found`);
      if (p.title !== undefined) task.title = p.title;
      if (p.description !== undefined) task.description = p.description;
      if (p.status !== undefined) task.status = p.status;
      if (p.assignedAgentId !== undefined) task.assignedAgentId = p.assignedAgentId;
      if (p.archived !== undefined) task.isArchived = p.archived;
      task.updatedAt = new Date().toISOString();
      return resOk(id, task);
    }

    case "tasks.delete": {
      const taskId = p.id;
      const removed = tasks.delete(taskId);
      return resOk(id, { ok: true, removed });
    }

    case "config.get":
      return resOk(id, {
        config: { gateway: { reload: { mode: "hot" } } },
        hash: "jrg-gateway-v1",
        exists: true,
        path: "/jrg/config.json",
      });

    case "config.patch":
    case "config.set":
      return resOk(id, { hash: "jrg-gateway-v1" });

    case "exec.approvals.get":
      return resOk(id, {
        path: "",
        exists: true,
        hash: "jrg-approvals",
        file: { version: 1, defaults: { security: "full", ask: "off", autoAllowSkills: true }, agents: {} },
      });

    case "exec.approvals.set":
      return resOk(id, { hash: "jrg-approvals" });

    case "exec.approval.resolve":
      return resOk(id, { ok: true });

    case "models.list":
      return resOk(id, { models: MODELS });

    case "skills.status":
      return resOk(id, {
        skills: [
          { name: "LEAD-HUNTER-CRM", status: "installed", version: "2.1.0" },
          { name: "WHATSAPP-PITCH-ENGINE", status: "installed", version: "1.5.0" },
          { name: "WEB-3D-ARCHITECT", status: "installed", version: "1.0.0" },
          { name: "CLIENT-DEPLOYER", status: "installed", version: "1.2.0" },
        ],
      });

    case "cron.list":
      return resOk(id, { jobs: [] });

    case "sessions.list": {
      const sessions = [...agents.values()].map((agent) => {
        const sessionKey = sessionKeyFor(agent.id);
        const history = getHistory(sessionKey);
        const settings = sessionSettings.get(sessionKey) || {};
        return {
          key: sessionKey,
          agentId: agent.id,
          updatedAt: history.length > 0 ? Date.now() : null,
          displayName: "Main",
          origin: { label: agent.name, provider: "jrg" },
          model: settings.model || MODELS[0].id,
          modelProvider: "jrg",
        };
      });
      return resOk(id, { sessions });
    }

    case "sessions.preview": {
      const keys = Array.isArray(p.keys) ? p.keys : [];
      const limit = typeof p.limit === "number" ? p.limit : 8;
      const maxChars = typeof p.maxChars === "number" ? p.maxChars : 240;
      const previews = keys.map((key) => {
        const history = getHistory(key);
        if (history.length === 0) return { key, status: "empty", items: [] };
        const items = history.slice(-limit).map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          text: String(msg.content || "").slice(0, maxChars),
          timestamp: Date.now(),
        }));
        return { key, status: "ok", items };
      });
      return resOk(id, { ts: Date.now(), previews });
    }

    case "sessions.patch": {
      const key = typeof p.key === "string" ? p.key : sessionKeyFor("jrg-director");
      const current = sessionSettings.get(key) || {};
      const next = { ...current };
      if (p.model !== undefined) next.model = p.model;
      if (p.thinkingLevel !== undefined) next.thinkingLevel = p.thinkingLevel;
      sessionSettings.set(key, next);
      return resOk(id, {
        ok: true,
        key,
        entry: { thinkingLevel: next.thinkingLevel },
        resolved: { model: next.model || MODELS[0].id, modelProvider: "jrg" },
      });
    }

    case "sessions.reset": {
      const key = typeof p.key === "string" ? p.key : sessionKeyFor("jrg-director");
      clearHistory(key);
      return resOk(id, { ok: true });
    }

    case "chat.send": {
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey : sessionKeyFor("jrg-director");
      const agentId = sessionKey.startsWith("agent:") ? sessionKey.split(":")[1] : "jrg-director";
      const agent = agents.get(agentId) || agents.get("jrg-director");
      const message = typeof p.message === "string" ? p.message.trim() : String(p.message || "").trim();
      const runId = typeof p.idempotencyKey === "string" && p.idempotencyKey ? p.idempotencyKey : randomId();
      if (!message) return resOk(id, { status: "no-op", runId });

      let aborted = false;
      activeRuns.set(runId, {
        runId,
        sessionKey,
        agentId,
        abort() {
          aborted = true;
        },
      });

      setImmediate(async () => {
        let seq = 0;
        const emitChat = (state, extra) => {
          sendEvent({
            type: "event",
            event: "chat",
            seq: seq++,
            payload: { runId, sessionKey, state, ...extra },
          });
        };

        try {
          const history = getHistory(sessionKey);
          let finalReply = "";

          // Notificar inicio
          emitChat("start", {});

          // Transmitir presencia activa
          sendEvent({
            type: "event",
            event: "presence",
            seq: seq++,
            payload: {
              sessions: {
                recent: [{ key: sessionKey, updatedAt: Date.now() }],
                byAgent: [{ agentId, recent: [{ key: sessionKey, updatedAt: Date.now() }] }],
              },
            },
          });

          // Intento de llamar a Gemini si hay API key
          if (GEMINI_API_KEY) {
            let streamingText = "";
            const geminiResult = await callGeminiStream(agent, message, history, (chunk) => {
              if (aborted) return;
              streamingText += chunk;
              emitChat("delta", { message: { role: "assistant", content: streamingText } });
            });
            if (geminiResult) {
              finalReply = geminiResult;
            }
          }

          // Fallback a motor contextual simulado si no hay API key o falló
          if (!finalReply) {
            finalReply = buildJRGReply(agent, message);
            const words = finalReply.split(" ");
            let partial = "";
            for (const word of words) {
              if (aborted) break;
              partial = partial ? `${partial} ${word}` : word;
              emitChat("delta", { message: { role: "assistant", content: partial } });
              await new Promise((resolve) => setTimeout(resolve, 35));
            }
          }

          if (aborted) {
            emitChat("aborted", {});
            return;
          }

          history.push({ role: "user", content: message });
          history.push({ role: "assistant", content: finalReply });
          emitChat("final", { stopReason: "end_turn", message: { role: "assistant", content: finalReply } });

          sendEvent({
            type: "event",
            event: "presence",
            seq: seq++,
            payload: {
              sessions: {
                recent: [{ key: sessionKey, updatedAt: Date.now() }],
                byAgent: [{ agentId, recent: [{ key: sessionKey, updatedAt: Date.now() }] }],
              },
            },
          });
        } catch (err) {
          emitChat("error", { error: err.message });
        } finally {
          activeRuns.delete(runId);
        }
      });

      return resOk(id, { status: "started", runId });
    }

    case "chat.abort": {
      const runId = typeof p.runId === "string" ? p.runId.trim() : "";
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey : "";
      let aborted = 0;
      if (runId) {
        const handle = activeRuns.get(runId);
        if (handle) {
          handle.abort();
          activeRuns.delete(runId);
          aborted += 1;
        }
      } else if (sessionKey) {
        for (const [activeRunId, handle] of activeRuns.entries()) {
          if (handle.sessionKey !== sessionKey) continue;
          handle.abort();
          activeRuns.delete(activeRunId);
          aborted += 1;
        }
      }
      return resOk(id, { ok: true, aborted });
    }

    case "chat.history": {
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey : sessionKeyFor("jrg-director");
      return resOk(id, { sessionKey, messages: getHistory(sessionKey) });
    }

    case "agent.wait": {
      const runId = typeof p.runId === "string" ? p.runId : "";
      const timeoutMs = typeof p.timeoutMs === "number" ? p.timeoutMs : 30000;
      const start = Date.now();
      while (activeRuns.has(runId) && Date.now() - start < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return resOk(id, { status: activeRuns.has(runId) ? "running" : "done" });
    }

    case "status": {
      const recent = [...agents.keys()].flatMap((agentId) => {
        const key = sessionKeyFor(agentId);
        const history = getHistory(key);
        return history.length > 0 ? [{ key, updatedAt: Date.now() }] : [];
      });
      return resOk(id, {
        sessions: {
          recent,
          byAgent: [...agents.keys()].map((agentId) => ({
            agentId,
            recent: recent.filter((entry) => entry.key.includes(`:${agentId}:`)),
          })),
        },
      });
    }

    case "wake":
      return resOk(id, { ok: true });

    default:
      return resOk(id, {});
  }
}

function startAdapter() {
  const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("⚡ JRG Agency Agent Gateway — Activo y Listo\n");
  });

  const wss = new WebSocketServer({ server: httpServer });
  wss.on("connection", (ws) => {
    let connected = false;
    let globalSeq = 0;

    const send = (frame) => {
      if (ws.readyState !== ws.OPEN) return;
      ws.send(JSON.stringify(frame));
    };

    const sendEventFn = (frame) => {
      if (frame.type === "event" && typeof frame.seq !== "number") {
        frame.seq = globalSeq++;
      }
      send(frame);
    };

    activeSendEventFns.add(sendEventFn);
    send({ type: "event", event: "connect.challenge", payload: { nonce: randomId() } });

    ws.on("message", async (raw) => {
      let frame;
      try {
        frame = JSON.parse(raw.toString("utf8"));
      } catch {
        return;
      }
      if (!frame || typeof frame !== "object" || frame.type !== "req") return;
      const { id, method, params } = frame;
      if (typeof id !== "string" || typeof method !== "string") return;

      if (method === "connect") {
        connected = true;
        send({
          type: "res",
          id,
          ok: true,
          payload: {
            type: "hello-ok",
            protocol: 3,
            adapterType: "jrg-orchestrator",
            features: {
              methods: [
                "agents.list",
                "agents.create",
                "agents.delete",
                "agents.update",
                "sessions.list",
                "sessions.preview",
                "sessions.patch",
                "sessions.reset",
                "chat.send",
                "chat.abort",
                "chat.history",
                "agent.wait",
                "tasks.list",
                "tasks.create",
                "tasks.update",
                "tasks.delete",
                "status",
                "config.get",
                "config.set",
                "config.patch",
                "agents.files.get",
                "agents.files.set",
                "exec.approvals.get",
                "exec.approvals.set",
                "exec.approval.resolve",
                "wake",
                "skills.status",
                "models.list",
                "cron.list",
              ],
              events: ["chat", "presence", "heartbeat"],
            },
            snapshot: {
              health: {
                agents: [...agents.values()].map((agent) => ({
                  agentId: agent.id,
                  name: agent.name,
                  isDefault: agent.id === "jrg-director",
                })),
                defaultAgentId: "jrg-director",
              },
              sessionDefaults: { mainKey: MAIN_KEY },
            },
            auth: { role: "operator", scopes: ["operator.admin"] },
            policy: { tickIntervalMs: 30000 },
          },
        });
        return;
      }

      if (!connected) {
        send(resErr(id, "not_connected", "Send connect first."));
        return;
      }

      try {
        send(await handleMethod(method, params, id, sendEventFn));
      } catch (error) {
        send(resErr(id, "internal_error", error instanceof Error ? error.message : "Internal error"));
      }
    });

    ws.on("close", () => activeSendEventFns.delete(sendEventFn));
    ws.on("error", () => activeSendEventFns.delete(sendEventFn));
  });

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`[JRG Gateway] Puerto ${ADAPTER_PORT} ya en uso, reutilizando gateway activo.`);
    } else {
      console.error("[JRG Gateway] Error en servidor:", err);
    }
  });

  httpServer.listen(ADAPTER_PORT, "127.0.0.1", () => {
    console.log(`[JRG Gateway] ⚡ Escuchando en ws://127.0.0.1:${ADAPTER_PORT}`);
    console.log(`[JRG Gateway] ⚡ Agentes JRG activos: ${[...agents.values()].map(a => a.name).join(", ")}`);
    console.log(`[JRG Gateway] ⚡ Leads en memoria: ${priorityLeads.length}`);
    console.log(`[JRG Gateway] ⚡ Modo LLM: ${GEMINI_API_KEY ? "Google Gemini Conectado" : "Motor Contextual JRG Agency"}`);
  });
}

if (require.main === module) {
  startAdapter();
}

module.exports = {
  handleMethod,
  startAdapter,
};
