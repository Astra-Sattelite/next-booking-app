'use client'

import React from 'react'
import { SubmitHandler, FieldError, FieldErrors } from "react-hook-form"
import FormInput from '@/components/ui/formInput'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Flight, FormRegister } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/lib/supabase/useUser'
import Box from '@/components/ui/box'


type FlightFormProps = {
  register: FormRegister
  errors: FieldErrors
  isSubmitting: boolean
}

export default function FlightForm(props: FlightFormProps) {

  const supabase = createClient()

  const queryClient = useQueryClient()
  const user = useUser()

  const onSubmit: SubmitHandler<Flight> = async (rawData) => {

    const data = {
      ...rawData,
      id: crypto.randomUUID(),
      created_by_user_id: user?.id
    }

    const resp = await supabase.from("flights").insert(data)

    if(resp.status === 201) {
      await fetch("/api/mail", {
        method: "POST",
        body: JSON.stringify({
          email: user?.email
        })
      })
    }

    queryClient.invalidateQueries({ queryKey: ["getFlights", user?.id] })
  }

  const f = props.register.f

  return (
    <div className="w-[450px] p-4 border ml-auto mr-auto m-4 rounded-xl">
      <form onSubmit={props.register.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 items-center">
        <label className="text-xl">Create new Flight</label>
        <Box row>
          <FormInput 
            label="From"
            defaultValue="New York"
            errors={props.errors.from as FieldError}
            register={{f, name: "from", options: { required: true }}}
          />

          <FormInput 
            label="To"
            defaultValue="Chicago"
            errors={props.errors.to as FieldError}
            register={{f, name: "to", options: { required: true }}}
          />
        </Box>

        <Box row>
          <FormInput 
            label="Departure time"
            defaultValue={formatDate(new Date(Date.now()))}
            errors={props.errors.departure_time as FieldError}
            register={{f, name: "departure_time", options: { required: true }}}
          />

          <FormInput 
            label="Arrival time"
            defaultValue={formatDate(new Date(Date.now()))}
            errors={props.errors.arrival_time as FieldError}
            register={{f, name: "arrival_time", options: { required: true }}}
          />
        </Box>

        <FormInput 
          label="Price"
          defaultValue={0}
          errors={props.errors.price as FieldError}
          register={{f, name: "price"}}
          type="number"
        />

        <input 
          className={`
            border rounded-md p-2 cursor-pointer
            hover:bg-gray-800 transition-all
            active:bg-gray-400 w-full
          `}
          type="submit" value="Submit" 
        />
      </form>
    </div>
  )
}