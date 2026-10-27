import { supabase, isSupabaseConfigured } from './client';

export const BUCKET_NAME = 'athlete-media';

export interface UploadResult {
  path: string;
  signedUrl: string | null;
  error: string | null;
}

export interface MediaFileItem {
  name: string;
  id: string;
  created_at?: string | null;
  size: number;
  signedUrl?: string;
  type: 'video' | 'image';
}

/**
 * Sube un archivo de video o fotografía al bucket privado de Supabase
 * Estructura de carpetas: {userId}/{folder}/{timestamp}-{fileName}
 */
export async function uploadAthleteMedia(
  file: File,
  userId: string,
  folder: 'videos' | 'progress_photos' = 'videos'
): Promise<UploadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      path: `simulated/${folder}/${file.name}`,
      signedUrl: URL.createObjectURL(file),
      error: null,
    };
  }

  // Validación de tamaño (Máximo 50 MB)
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      path: '',
      signedUrl: null,
      error: 'El archivo excede el tamaño máximo permitido de 50 MB.',
    };
  }

  // Sanitizar nombre de archivo
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${userId}/${folder}/${Date.now()}-${cleanName}`;

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { path: '', signedUrl: null, error: error.message };
    }

    // Obtener URL firmada temporal (válida por 2 horas)
    const { data: signedData, error: signError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(data.path, 7200);

    return {
      path: data.path,
      signedUrl: signedData?.signedUrl || null,
      error: signError ? signError.message : null,
    };
  } catch (err: any) {
    return {
      path: '',
      signedUrl: null,
      error: err.message || 'Error inesperado al subir el archivo.',
    };
  }
}

/**
 * Obtiene una URL firmada de acceso seguro para un archivo privado
 */
export async function getMediaSignedUrl(filePath: string, expiresInSeconds = 7200): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error) {
      console.error('Error generando URL firmada:', error.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error('Error al solicitar URL firmada:', err);
    return null;
  }
}

/**
 * Lista los archivos multimedia de un atleta
 */
export async function listAthleteMedia(
  userId: string,
  folder: 'videos' | 'progress_photos' = 'videos'
): Promise<MediaFileItem[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`${userId}/${folder}`, {
        limit: 20,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error || !data) {
      console.error('Error listando multimedia:', error?.message);
      return [];
    }

    // Generar URL firmada para cada archivo
    const items: MediaFileItem[] = [];
    for (const item of data) {
      if (item.name.startsWith('.')) continue; // Ignorar metadatos
      const fullPath = `${userId}/${folder}/${item.name}`;
      const signedUrl = await getMediaSignedUrl(fullPath);

      const isVideo = item.metadata?.mimetype?.startsWith('video/') || item.name.match(/\.(mp4|mov|webm)$/i);

      items.push({
        id: item.id || item.name,
        name: item.name,
        created_at: item.created_at,
        size: item.metadata?.size || 0,
        signedUrl: signedUrl || undefined,
        type: isVideo ? 'video' : 'image',
      });
    }

    return items;
  } catch (err) {
    console.error('Error en listAthleteMedia:', err);
    return [];
  }
}

/**
 * Elimina un archivo multimedia del almacenamiento
 */
export async function deleteAthleteMedia(filePath: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando archivo:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error en deleteAthleteMedia:', err);
    return false;
  }
}
