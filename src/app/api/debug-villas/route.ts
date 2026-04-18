import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('villas').select('id, name, location_label, destination_id');
  const { data: dests } = await supabase.from('destinations').select('id, name, filter_param');
  return NextResponse.json({ villas: data, dests, error });
}
