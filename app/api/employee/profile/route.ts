import { NextRequest, NextResponse } from 'next/server';
import { employeeStorage } from '@/lib/employee-storage';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';


// Helper to get user from Supabase session cookie (Next.js 14+)
async function getUserFromCookie() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = await cookies();
  // Build cookie header string
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
  console.log('DEBUG: Cookies received:', allCookies);
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Cookie: cookieHeader } },
  });
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('DEBUG: Supabase user:', user, 'error:', error);
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }
    const allEmployees = employeeStorage.getAllEmployees();
    const profile = allEmployees.find(emp => emp.email === user.email);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, profile });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
