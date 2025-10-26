import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function GoogleLoginBtn() {
  const supabase = createClient();
  const handleSumbit = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };
  return (
    <button onClick={handleSumbit} className="p-4 bg-base-100 flex items-center gap-2 w-fit rounded-lg btn self-center">
      <img 
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg" 
        alt="google-logo" 
        className="size-5"
      />
      Login with Google
    </button>
  );
}
