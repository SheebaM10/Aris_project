import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        toast({ title: "Email confirmed", description: "Your account is verified." });
        navigate("/");
      }
    });

    // Also check current session in case it was already set
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return null;
};

export default AuthCallback;


