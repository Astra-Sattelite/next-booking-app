import useSupabase from "@/lib/supabase/useSupabase";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useUser() {
  const client = useSupabase();
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    (async function () {
      const resp = await client.auth.getUser()
      setUser(resp.data.user)
    })()
  }, [])

  return user
}