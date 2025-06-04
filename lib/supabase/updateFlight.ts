import { QueryClient } from "@tanstack/react-query"
import { Flight } from "../types"
import { SupabaseClient, User } from "@supabase/supabase-js"

export const updateFlight = async (
  supabase: SupabaseClient<any, "public", any>, 
  queryClient: QueryClient, 
  newData: Flight, 
  oldData: Flight,
  user: User | null
) => {
  const data: Flight = {
    ...newData,
    id: oldData.id,
    created_by_user_id: oldData.created_by_user_id
  }

  await supabase.from("flights").update(data).eq('id', data.id)

  queryClient.invalidateQueries({ queryKey: ["getFlights", user?.id] })
}