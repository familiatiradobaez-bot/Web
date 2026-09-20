export async function onRequestPost(context: { env: { PAYPAL_CLIENT_ID: string; PAYPAL_SECRET: string } }) {
  try {
    const { amount } = await context.request.json();

    // 1. Obtener Token de acceso de PayPal
    const auth = btoa(`${context.env.PAYPAL_CLIENT_ID}:${context.env.PAYPAL_SECRET}`);
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response(JSON.stringify({ error: tokenData }), { status: tokenResponse.status });
    }

    // 2. Crear la orden de pago en PayPal
    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount.toString(),
            },
          },
        ],
      }),
    });

    const orderData = await orderResponse.json();

    return new Response(JSON.stringify(orderData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
