"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export function useUser() {
  const [user, setUser] = useState<null | User>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      setUserLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const currentUser = data?.session?.user ?? null;
        setUser(currentUser);
      } catch (err) {
        console.log(err);
      } finally {
        setUserLoading(false);
      }
    }

    fetchUser();
  }, []);

  // console.log(userLoading)

  return {user, userLoading};
}
