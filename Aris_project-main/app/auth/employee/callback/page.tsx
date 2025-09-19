'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function EmployeeAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/employee-portal');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/employee-portal');
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [router]);

  return null;
}


