import { json } from "../lib/db";

type ApiContext = { request: Request; env: { PAYPAL_CLIENT_ID?: string; PAYPAL_SECRET?: string; PAYPAL_ENV?: string } };

export async function onRequestPost(context: ApiContext) {
  try {
    const body = await context.request.json() as { amount?: unknown };
    const amount = typeof body.amount === "number" ? body.amount : Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) return json({ error: "El importe debe ser mayor que cero" }, 400);
    if (!context.env.PAYPAL_CLIENT_ID || !context.env.PAYPAL_SECRET) {
      return json({ error: "PayPal no está configurado en el entorno" }, 503);
    }

    const isLive = context.env.PAYPAL_ENV === "live";
    const baseUrl = isLive ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
    const auth = btoa(`${context.env.PAYPAL_CLIENT_ID}:${context.env.PAYPAL_SECRET}`);
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenResponse.json() as { access_token?: string; [key: string]: unknown };
    if (!tokenResponse.ok || !tokenData.access_token) return json({ error: tokenData }, tokenResponse.status || 502);

    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenData.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount.toFixed(2) } }],
      }),
    });
    const orderData = await orderResponse.json();
    return json(orderData, orderResponse.status);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Error al crear el pedido" }, 500);
  }
}
