"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import useSupabase from "@/lib/supabase/useSupabase";

export function LogoutButton() {
  const router = useRouter();
  const supabase = useSupabase()

  const logout = async () => {
    async function signOut() {
      await supabase.auth.signOut({ scope: "global" })
    }
    signOut()
    router.push("/auth/login")
  };

  return <Button onClick={logout}>Logout</Button>;
}