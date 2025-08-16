import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('gallery_videos').select('*');
  if (error) {
    console.error('Supabase GET error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
  console.log('Supabase GET data:', data);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { category, links, deleteCategory } = await request.json();
  if (deleteCategory) {
    const { error } = await supabase
      .from('gallery_videos')
      .delete()
      .eq('category', category);
    if (error) {
      console.error('Supabase DELETE error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }
    console.log('Supabase DELETE success for category:', category);
    return NextResponse.json({ success: true });
  }
  const { data, error } = await supabase
    .from('gallery_videos')
    .upsert([{ category, links }], { onConflict: 'category' });
  if (error) {
    console.error('Supabase POST error:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
  console.log('Supabase POST data:', data);
  return NextResponse.json(data);
}
