"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

function SignoutBtn() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user ?? undefined);
      setLoading(false);
    };

    checkUser();
  }, [supabase]);

  const handleSubmit = async () => {
    try {
      if (user) {
        await supabase.auth.signOut();
      }
      toast.success("Successfully logout.");
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center gap-2" onClick={handleSubmit}>
          <LogOut size={16} className="text-primary" />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </div>
      )}
    </>
  );
}

export default SignoutBtn;
