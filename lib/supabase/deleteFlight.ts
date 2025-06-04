import { SupabaseClient, User } from "@supabase/supabase-js"
import { QueryClient } from "@tanstack/react-query"
import { UUID } from "crypto"

export const deleteFlight = async (
  supabase: SupabaseClient<any, "public", any>, 
  queryClient: QueryClient,
  user: User | null,
  id: UUID,
  invalidate: string

) => {
  await supabase.from("flights").delete().eq('id', id)

  queryClient.invalidateQueries({ queryKey: [invalidate, user?.id] })
} 