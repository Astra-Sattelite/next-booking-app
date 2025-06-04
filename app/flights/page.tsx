"use client"

import { Flight, UserWithRole } from "@/lib/types";
import useSupabase from "@/lib/supabase/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { useUser } from '@/lib/supabase/useUser';
import FlightCard from '@/components/ui/flightCard';
import { useForm } from 'react-hook-form';

export default function Page() {
  const user = useUser()
  const supabase = useSupabase()
  const {
    register,
    formState: {errors},
  } = useForm<Flight>()

  const {data: data, isLoading } = useQuery({
    queryKey: ['getFlights', user?.id],
    queryFn: async () => {

      const auth = await supabase.auth.getUser()
      const users = await supabase.from("users").select()
      const userWithRole: UserWithRole = users.data?.find(userWithRole => userWithRole.id === auth.data.user!.id)
      const bookedFlights = userWithRole.booked_flights || []

      const resp = await supabase.from("flights").select().overrideTypes<Flight[]>()

      return { 
        flights: resp?.data?.filter(flight => !bookedFlights.includes(flight.id)),
        userWithRole: userWithRole
      }
    }
  })

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-3 gap-2">
        {isLoading 
          ? <p>Loading. . .</p>
          : data?.flights?.map(flight =>
              <FlightCard  
                key={flight.id}
                flight={flight}
                isAdmin={false}
                register={register}
                canBeBooked={data.userWithRole.role === "user"}
              />
            )
        }
      </div>
    </div>
  )
}

