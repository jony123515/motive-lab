import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// GET: Obtener lista de todos los perfiles de usuarios registrados
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        simulated: true,
        users: [
          {
            id: 'usr-demo-001',
            full_name: 'Alejandro Morales',
            email: 'alejandro.motive@ejemplo.com',
            role: 'client',
            subscription_tier: 'pro',
            subscription_status: 'active',
            created_at: new Date().toISOString(),
          },
          {
            id: 'usr-demo-002',
            full_name: 'Mariana Silva',
            email: 'mariana.silva@ejemplo.com',
            role: 'client',
            subscription_tier: 'coach',
            subscription_status: 'active',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: 'usr-demo-003',
            full_name: 'Carlos Mendoza',
            email: 'carlos.mendoza@ejemplo.com',
            role: 'client',
            subscription_tier: 'free',
            subscription_status: 'inactive',
            created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
          },
        ],
      });
    }

    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role, subscription_tier, subscription_status, created_at, avatar_url')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('Error fetching admin users:', err);
    return NextResponse.json({ error: err.message || 'Error al obtener usuarios' }, { status: 500 });
  }
}

// PATCH: Actualizar rol o nivel de suscripción de un usuario
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, role, subscriptionTier } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Falta userId' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Modo simulado: actualización aprobada',
      });
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (role) updateData.role = role;
    if (subscriptionTier) {
      updateData.subscription_tier = subscriptionTier;
      updateData.subscription_status = subscriptionTier === 'free' ? 'inactive' : 'active';
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data });
  } catch (err: any) {
    console.error('Error updating user:', err);
    return NextResponse.json({ error: err.message || 'Error al actualizar usuario' }, { status: 500 });
  }
}
