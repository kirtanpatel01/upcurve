"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUser() {
  const [user, setUser] = useState<null | { id: string; email: string }> (null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser({ id: user.id, email: user.email! });
      setLoading(false);
    };

    getUser();
  }, [supabase]);

  return { user, loading };
}
