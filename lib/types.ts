import { UUID } from "crypto"
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form"
import { z } from "zod/v4"

export const flightSchema = z.object({
  from: z.string(),
  to: z.string(),
  departure_time: z.iso.date(),
  arrival_time: z.iso.date(),
  price: z.coerce.number()
})
// z.string().transform((str) => new Date(str))
export type ZodFlight = z.infer<typeof flightSchema>

export type Role = "user" | "admin"

export type Flight = {
  created_by_user_id: UUID
  id: UUID
  from: string
  to: string
  departure_time: Date
  arrival_time: Date
  price: number
}

export type FormRegister = {
  f: UseFormRegister<any>,
  handleSubmit: UseFormHandleSubmit<any, any>,
}

export type UserWithRole = {
  id: UUID
  created_at: Date
  role: Role
  booked_flights: UUID[]
}