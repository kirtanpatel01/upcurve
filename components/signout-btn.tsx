"use client";

import { createClient } from "@/utils/supabase/client";
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import Link from "next/link";

function SignoutBtn() {
  const [user, setUser] = useState<null | object>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully logout.");
      router.push("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center w-full py-1.5">
        <Spinner />
      </div>
    );
  }

  // Logged-out UI
  if (!user) {
    return (
      <Link href="/auth/login" className="flex items-center gap-2 w-full">
        <LogIn size={16} className="text-primary" />
        <span className="group-data-[collapsible=icon]:hidden">Login</span>
      </Link>
    );
  }

  // Logged-in UI
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full text-left"
    >
      <LogOut size={16} className="text-primary" />
      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
    </button>
  );
}

export default SignoutBtn;
