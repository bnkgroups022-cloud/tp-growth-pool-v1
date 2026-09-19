import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';
import type { BusinessType } from '@/lib/types/domain';

export async function getBusinessCatalog(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from('business_types').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as BusinessType[];
}

export async function getUserBusinessSelectionIds(supabase: SupabaseClient<Database>, userId: string) {
  const { data, error } = await supabase
    .from('business_selections')
    .select('business_type_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.business_type_id));
}
