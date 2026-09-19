import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/types/database.types';
import type { ActivityFeedItem } from '@/lib/types/domain';

export async function getRecentActivity(supabase: SupabaseClient<Database>, limit = 12) {
  const { data, error } = await supabase
    .from('activity_feed')
    .select('id, type, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ActivityFeedItem[];
}
