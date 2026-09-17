import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Route to proxy webhook POST requests from Cloud Run server
  app.post("/api/proxy-webhook", async (req, res) => {
    const { webhookUrl, payload } = req.body;

    if (!webhookUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: webhookUrl",
      });
    }

    const isLocalhost =
      webhookUrl.includes("localhost") || webhookUrl.includes("127.0.0.1");

    try {
      console.log(`[Proxy Webhook] Forwarding payload to: ${webhookUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
          "User-Agent": "Lumina-Dental-Webhook-Agent/1.0",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await response.text().catch(() => "");
      let parsedJson = null;
      try {
        parsedJson = JSON.parse(responseText);
      } catch {
        // Response is non-JSON text
      }

      if (response.ok || response.status === 200 || response.status === 201) {
        return res.json({
          success: true,
          status: response.status,
          message: `Successfully delivered to n8n webhook (HTTP ${response.status})!`,
          data: parsedJson || responseText,
        });
      } else {
        return res.json({
          success: false,
          status: response.status,
          message: `Target webhook endpoint returned HTTP ${response.status}`,
          data: responseText,
        });
      }
    } catch (err: any) {
      console.error("[Proxy Webhook Error]:", err?.message || err);

      return res.json({
        success: false,
        isNetworkError: true,
        isLocalhost,
        error: err?.message || "Failed to reach target webhook URL.",
        message: isLocalhost
          ? "Target points to http://localhost. Since this app runs in a cloud environment, it cannot directly reach your personal laptop's localhost. Use an ngrok URL (e.g. https://xxxx.ngrok-free.app/webhook-test/...) or test via cURL!"
          : `Network error connecting to webhook target: ${err?.message || "Endpoint offline or unreachable"}.`,
      });
    }
  });

  // Built-in Mock n8n Webhook Endpoint for testing
  app.post("/api/mock-n8n-webhook", (req, res) => {
    console.log("[Mock n8n Webhook] Received payload:", JSON.stringify(req.body, null, 2));
    res.status(200).json({
      status: "success",
      message: "Lumina Dental Built-in n8n Webhook Receiver successfully accepted enquiry payload!",
      receivedAt: new Date().toISOString(),
      payloadSummary: {
        submissionId: req.body?.submissionId,
        patientName: req.body?.patient?.fullName,
        email: req.body?.patient?.email,
        treatment: req.body?.appointment?.treatmentTitle || req.body?.appointment?.treatmentType,
      },
    });
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumina Dental App running on http://localhost:${PORT}`);
  });
}

startServer();
