
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const sessionId = cookies().get('session_id')?.value;
    
    if (sessionId) {
      await db.query('DELETE FROM sessions WHERE id = ?', [sessionId]);
    }
    
    cookies().delete('session_id');
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
