import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured, SUBSCRIPTION_PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, billingInterval, userId, userEmail } = body;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan || plan.id === 'free') {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
    }

    const priceMxn = billingInterval === 'yearly' ? plan.priceMxnYearly : plan.priceMxnMonthly;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Si Stripe no tiene claves reales configuradas aún, permitir modo simulación de prueba
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json({
        simulated: true,
        message: 'Modo de prueba: Stripe no configurado aún con claves secretas.',
        url: `${origin}/dashboard?payment=simulated_success&plan=${planId}`,
      });
    }

    // Crear sesión de pago real con Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail || undefined,
      client_reference_id: userId,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      tax_id_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: `MOTIVE LAB - ${plan.name}`,
              description: plan.description,
            },
            unit_amount: priceMxn * 100, // En centavos
            recurring: {
              interval: billingInterval === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || 'anonymous',
        planId: plan.id,
        billingInterval,
      },
      success_url: `${origin}/dashboard?payment=success&plan=${plan.id}`,
      cancel_url: `${origin}/precios?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creando sesión de Stripe:', err);
    return NextResponse.json(
      { error: err.message || 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
