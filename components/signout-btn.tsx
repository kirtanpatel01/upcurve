"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function SignoutBtn() {
  const [showToast, setShowToast] = useState(false);
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

      // revalidatePath("/", "layout");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);

      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        disabled={loading || !user}
        onClick={handleSubmit}
        className='is-drawer-close:tooltip is-drawer-close:tooltip-right'
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <span className="w-full flex justify-start items-center gap-2">
            <LogOut size={16} />
            Logout
          </span>
        )}
      </button>

      {showToast && (
        <div className="toast">
          <div className="alert alert-success">
            <span>Logout Successfully.</span>
          </div>
        </div>
      )}
    </>
  );
}

export default SignoutBtn;
