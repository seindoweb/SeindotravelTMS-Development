import { Link, usePage } from '@inertiajs/react'
import type { PageProps } from '@inertiajs/core';
import React from 'react'

interface AuthenticatedLogoProps extends PageProps {
    appIconDefault?: string;
}

export default function AuthenticatedLogo() {
   const { appIconDefault } = usePage<AuthenticatedLogoProps>().props;

  return (
    <div className="flex h-[72px] shrink-0 items-center justify-center border-b border-primary-bright">
        <Link
            href="/dashboard"
            aria-label="Travel Management System"
            className="relative flex items-center justify-center group"
        >
            {/* Logo */}
            <div className="relative flex items-center justify-center w-12 h-12">
                {/* Glow */}
                <div className="absolute transition-all duration-300 rounded-full inset-1 bg-tertiary/20 blur-xl opacity-60 group-hover:opacity-100" />

                <img
                    src={appIconDefault}
                    alt="Travel Management System"
                    className="relative object-contain transition-all duration-300 h-11 w-11 drop-shadow-lg group-hover:scale-110 group-hover:drop-shadow-xl"
                />

                {/* Online indicator */}
                <span className="absolute top-0 right-0 w-3 h-3 border-2 rounded-full shadow-sm border-primary-dark bg-tertiary" />
            </div>

            {/* Tooltip */}
            <span className="pointer-events-none absolute left-[62px] top-1/2 z-[100] -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                Travel Management System
            </span>
        </Link>
    </div>
  )
}
