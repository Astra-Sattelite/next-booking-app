import { QueryClient } from "@tanstack/react-query"
import { Flight, UserWithRole } from "../types"
import { SupabaseClient, User } from "@supabase/supabase-js"

export const updateUser = async (
  supabase: SupabaseClient<any, "public", any>, 
  queryClient: QueryClient, 
  user: User | null,
  userWithRole: UserWithRole,
  flight: Flight
) => {

  const data: UserWithRole = {
    ...userWithRole,
    booked_flights: userWithRole.booked_flights === null ? [flight.id] : userWithRole.booked_flights.concat(flight.id)
  }

  await supabase.from("users").update(data).eq('id', data.id)

  queryClient.invalidateQueries({ queryKey: ["getFlights", user?.id] })
}