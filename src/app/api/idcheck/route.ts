// src/app/api/check-student-id/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client'; // Import the browser client

export async function POST(req: NextRequest) {
  // Initialize the Supabase client using your custom connector
  const supabase = createClient();

  const { studentid } = await req.json();

  if (!studentid) {
    return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('apidata')
    .select('email')
    .eq('studentid', studentid)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: 'Student ID not found' }, { status: 404 });
  }

  // Prepare the response with CORS headers
  const response = NextResponse.json({ email: data.email }, { status: 200 });

  return response;
}
