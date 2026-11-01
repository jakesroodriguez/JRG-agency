// Serverless endpoint for JRG Studio Landing Config
let cachedConfig = null;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(cachedConfig || { status: 'default' });
  }

  if (req.method === 'POST') {
    try {
      const newConfig = req.body;
      if (!newConfig || typeof newConfig !== 'object') {
        return res.status(400).json({ error: 'Configuración inválida' });
      }

      cachedConfig = {
        ...newConfig,
        serverUpdatedAt: new Date().toISOString()
      };

      return res.status(200).json({
        success: true,
        message: 'Configuración guardada en el servidor Edge',
        updatedAt: cachedConfig.serverUpdatedAt
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error al procesar la configuración', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
