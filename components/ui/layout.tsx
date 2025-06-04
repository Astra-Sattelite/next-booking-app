import React, { PropsWithChildren } from 'react'
import NextBreadcrumb from './breadcrumbs'
import { hasEnvVars } from '@/lib/utils'
import { EnvVarWarning } from '../env-var-warning'
import { AuthButton } from '../auth-button'
import Link from 'next/link'

export default function Layout({ children }: PropsWithChildren) {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20">
        <nav className="w-full flex items-center border-b border-b-foreground/10 h-16 px-16 justify-between">
          <NextBreadcrumb
            homeElement="Home"
            separator=">"
            containerClasses="breadcrumbs"
            listClasses="breadcrumb-item"
            activeClasses="active"
            capitalizeLinks={true}
          />

          <div className="gap-2 flex flex-row">
            <Link href="/profile">Profile</Link>
            <Link href="/flights">Flights</Link>
          </div>

          {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        </nav>
        <div className="flex-1 flex flex-col gap-20 px-16">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
