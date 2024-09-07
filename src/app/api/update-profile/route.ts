import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  // Get the current user's session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get the form data from the request body
  const formData = await req.json();

  // Update the user's profile in the apidata table
  const { data, error } = await supabase
    .from('apidata')
    .update({
      currentstatus: formData.currentStatus,
      phonenumber: formData.phoneNumber,
      bloodgroup: formData.bloodGroup,
      hall: formData.hall,
      linkedin: formData.linkedin,
      uniqueid: formData.uniqueId,
    })
    .eq('email', user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
}