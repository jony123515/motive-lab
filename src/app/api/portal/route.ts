import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured || !stripe) {
      return NextResponse.json(
        { error: 'Portal de clientes no disponible en modo simulación.' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { userId, customerId: directCustomerId } = body;

    let customerId = directCustomerId;

    if (!customerId && userId && supabaseAdmin) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      customerId = profile?.stripe_customer_id;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'No se encontró una suscripción activa de Stripe vinculada a este usuario.' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error('Error creando sesión del portal de Stripe:', err);
    return NextResponse.json(
      { error: err.message || 'Error al abrir el portal de facturación' },
      { status: 500 }
    );
  }
}
