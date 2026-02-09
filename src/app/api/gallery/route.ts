import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_PATH = path.join(process.cwd(), 'gallery_videos.json');

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Failed to read gallery data:', error);
    return NextResponse.json({ error: 'Gallery data not found' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry = await request.json();
    let data = [];
    try {
      data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
    } catch (err) {
      // If file doesn't exist or can't be read, start with empty array
      data = [];
    }
    // Update or add new entry by category
    const existingIdx = data.findIndex((e: {category: string}) => e.category === newEntry.category);
    if (existingIdx !== -1) {
      data[existingIdx] = newEntry;
    } else {
      data.push(newEntry);
    }
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update gallery data:', error);
    return NextResponse.json({ error: 'Failed to update gallery data' }, { status: 500 });
  }
}
