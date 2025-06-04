import React from 'react'
import { Flight } from '../../lib/types';
import FormInput from './formInput';
import { FieldError, useForm, UseFormRegister } from 'react-hook-form';
import Box from './box';
import { useUser } from '@/lib/supabase/useUser';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { updateFlight } from '@/lib/supabase/updateFlight';
import { deleteFlight } from '@/lib/supabase/deleteFlight';
import { updateUser } from '@/lib/supabase/updateUser';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver'

type FlightCardProps = {
  flight: Flight
  register: UseFormRegister<any>
  isAdmin: boolean
  canBeBooked?: boolean
}

export default function FlightCard(props: FlightCardProps) {

  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<Flight>()

  const supabase = createClient()

  const queryClient = useQueryClient()
  const user = useUser()

  const f = register

  const { data: userWithRole, isLoading } = useQuery({
    queryKey: ['getUsers'],
    queryFn: async () => {
      const auth = await supabase.auth.getUser()
      const resp = await supabase.from("users").select()

      return resp?.data?.find(userWithRole => userWithRole.id === auth.data.user!.id)
    }
  })

  const styles = StyleSheet.create({
    page: { flexDirection: 'row' },
    section: { margin: 10, padding: 10, flexGrow: 1 },
  })

  const FlightPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>From {props.flight.from}</Text>
        </View>
        <View style={styles.section}>
          <Text>To  {props.flight.to}</Text>
        </View>
      </Page>
    </Document>
  )

  const generatePdf = async () => {
    const blob = await pdf(<FlightPDF />).toBlob()
    saveAs(blob, "flight.pdf")
  }

  return (
    <div 
      className="flex flex-col p-4 rounded-xl border"
    >
      {isLoading 
        ? <p>Loading. . .</p>
        : <form onSubmit={handleSubmit((e) => updateFlight(supabase, queryClient, e, props.flight, user))} className="w-full flex flex-col gap-3">
            <Box row>
              <FormInput 
                label="From"
                defaultValue={props.flight.from}
                errors={errors.from as FieldError}
                register={{f, name: "from", options: { required: true }}}
                disabled={props.isAdmin}
              />

              <FormInput 
                label="To"
                defaultValue={props.flight.to}
                errors={errors.to as FieldError}
                register={{f, name: "to", options: { required: true }}}
                disabled={props.isAdmin}
              />
            </Box>

            <Box row>
              <FormInput 
                label="Departure time"
                defaultValue={props.flight.departure_time}
                errors={errors.departure_time as FieldError}
                register={{f, name: "departure_time", options: { required: true }}}
                disabled={props.isAdmin}
              />

              <FormInput 
                label="Arrival time"
                defaultValue={props.flight.arrival_time}
                errors={errors.arrival_time as FieldError}
                register={{f, name: "arrival_time", options: { required: true }}}
                disabled={props.isAdmin}
              />
            </Box>

            <FormInput 
              label="Price"
              errors={errors.price as FieldError}
              defaultValue={props.flight.price}
              register={{f, name: "price"}}
              disabled={props.isAdmin}
              type="number"
            />

            {props.isAdmin && 
              <Box row>
                <Button 
                  className={`
                    border rounded-md p-2 cursor-pointer
                    bg-red-500
                    hover:bg-red-700 transition-all
                    active:bg-red-800 w-full
                    text-white h-full
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    deleteFlight(supabase, queryClient, user, props.flight.id, "getFlights")
                  }}
                >
                  Delete
                </Button>

                <input
                  className={`
                    border rounded-md p-2 cursor-pointer
                    hover:bg-gray-800 transition-all
                    active:bg-gray-400 w-full
                  `}
                  type="submit" value="Update" 
                />
              </Box>
            }

            {props.canBeBooked && 
              <Button onClick={() => updateUser(supabase, queryClient, user, userWithRole, props.flight)}>Book a flight</Button>
            }
          </form>
      }
      <Button className="my-2" onClick={() => generatePdf()}>Download as PDF</Button>
    </div>
  )
}