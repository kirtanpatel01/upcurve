"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<null | { id: string; email: string }> (null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser({ id: user.id, email: user.email! });
      setLoading(false);
    };

    getUser();
  }, []);

  return { user, loading };
}
