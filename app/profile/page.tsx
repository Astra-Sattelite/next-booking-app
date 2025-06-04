"use client"

import FlightForm from '../../components/ui/flightForm';
import { Flight, flightSchema, ZodFlight } from "@/lib/types";
import useSupabase from "@/lib/supabase/useSupabase";
import { useQuery } from "@tanstack/react-query";
import { useUser } from '@/lib/supabase/useUser';
import FlightCard from '@/components/ui/flightCard';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';

export default function Page() {
  const supabase = useSupabase()

  const user = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZodFlight>({
    resolver: standardSchemaResolver(flightSchema)
  })

  const {data: data, isLoading } = useQuery({
    queryKey: ['getFlights', user?.id],
    queryFn: async () => {
      const resp = await supabase.from("flights").select().overrideTypes<Flight[]>()
      const auth = await supabase.auth.getUser()
      const users = await supabase.from("users").select()

      const userWithRole = users.data?.find(uwr => uwr.id === auth.data.user?.id)

      return {
        userWithRole,
        flights: resp.data || []
      }
    }
  })

  if(isLoading) return <div>Loading. . .</div>
  if(!data) return;

  const isAdmin = data.userWithRole.role === "admin"

  return (
    <div className="flex flex-col w-full gap-4">
      {isAdmin &&
        <div className="flex flex-col gap-2">
          <FlightForm register={{ f: register, handleSubmit }} errors={errors} isSubmitting={isSubmitting} />
        </div>
      }

      <h1 className="mr-auto ml-auto text-2xl">{isAdmin ? "Created flights" : "Booked flights"}</h1>

      <div className="grid grid-cols-3 gap-2">
        {data.flights.map(flight =>
          <FlightCard  
            key={flight.id + "_admin"}
            flight={flight}
            isAdmin={isAdmin}
            register={register}
          />
        )}
      </div>
    </div>
  )
}

