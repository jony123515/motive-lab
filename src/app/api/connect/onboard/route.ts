import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const body = await req.json().catch(() => ({}));
    const { coachId, email } = body;

    if (!isStripeConfigured || !stripe) {
      return NextResponse.json({
        simulated: true,
        message: 'Modo de prueba: Stripe Connect no configurado con claves activas.',
        url: `${origin}/coach?connect=simulated_success`,
      });
    }

    // 1. Crear cuenta Express para el Coach en México
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'MX',
      email: email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        coachId: coachId || 'anonymous',
      },
    });

    // 2. Guardar el account.id en Supabase si aplica
    if (coachId && supabaseAdmin) {
      await supabaseAdmin
        .from('profiles')
        .update({
          stripe_customer_id: account.id, // o columna stripe_connect_account_id
          updated_at: new Date().toISOString(),
        })
        .eq('id', coachId);
    }

    // 3. Crear enlace de Onboarding seguro de Stripe
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/coach?connect=refresh`,
      return_url: `${origin}/coach?connect=success`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err: any) {
    console.error('Error generando enlace de Stripe Connect:', err);
    return NextResponse.json(
      { error: err.message || 'Error al conectar con Stripe Connect' },
      { status: 500 }
    );
  }
}
