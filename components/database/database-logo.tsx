import React from 'react'

export function DatabaseLogo({ type, className = 'w-6 h-6' }: { type: string; className?: string }) {
  switch (type.toUpperCase()) {
    case 'POSTGRESQL':
    case 'PG':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* PostgreSQL Elephant Logo */}
          <path fill="#336791" d="M64 8C33.07 8 8 33.07 8 64c0 19.35 9.8 36.41 24.77 46.46l4.63-12.78C26.96 90.09 20 77.85 20 64c0-24.3 19.7-44 44-44s44 19.7 44 44c0 13.85-6.96 26.09-17.4 33.68l4.63 12.78C110.2 100.41 120 83.35 120 64c0-30.93-25.07-56-56-56z"/>
          <path fill="#336791" d="M64.6 28c-17.7 0-32.1 12.8-34.4 29.5-1.1 7.9 1 15.8 5.7 22.1l7.3-20.1c1.2-3.3 4.3-5.5 7.8-5.5h27.2c3.5 0 6.6 2.2 7.8 5.5l7.3 20.1c4.7-6.3 6.8-14.2 5.7-22.1C96.7 40.8 82.3 28 64.6 28z"/>
          <path fill="#4183C4" d="M52 64h24l-4 16H56l-4-16z"/>
        </svg>
      )
    case 'NEON':
    case 'NE':
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Official Neon Logo */}
          <rect width="100" height="100" rx="22" fill="#00E5A0"/>
          <path d="M28 72V28l44 44V28" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'SUPABASE':
    case 'SB':
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Official Supabase Emerald Lightning Logo */}
          <path fill="url(#supabase-grad)" d="M54.8 96.6c-2.1 2.9-6.7 1.4-6.7-2.2V58.8H12.8c-3.7 0-5.8-4.3-3.5-7.3L50.4 3.4c2.1-2.9 6.7-1.4 6.7 2.2V41.2h35.3c3.7 0 5.8 4.3 3.5 7.3L54.8 96.6z"/>
          <defs>
            <linearGradient id="supabase-grad" x1="15" y1="5" x2="85" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3ECF8E"/>
              <stop offset="1" stopColor="#249D61"/>
            </linearGradient>
          </defs>
        </svg>
      )
    case 'MYSQL':
    case 'MY':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* Official MySQL Dolphin Logo */}
          <path fill="#00758F" d="M116.8 54.4c-2.4-7.2-7.2-13.6-13.6-18.4-12-8.8-28-12-42.4-8.8-14.4 3.2-26.4 12.8-33.6 25.6C20 65.6 17.6 79.2 20.8 92c2.4 9.6 8 18.4 16 24 8 5.6 17.6 8 27.2 7.2 13.6-1.6 26.4-8.8 35.2-19.2 8.8-10.4 13.6-24 13.6-38 0-4-0.8-7.6-2.4-11.6z"/>
          <path fill="#F29111" d="M72 40c-4.8 0-9.6 1.6-13.6 4.8L44 32c-3.2-2.4-7.2-3.2-11.2-2.4-4 0.8-7.2 3.2-9.6 6.4-4 5.6-4.8 12.8-3.2 19.2l12.8-6.4c0.8-3.2 2.4-5.6 4.8-7.2 2.4-1.6 5.6-1.6 8.8-0.8l14.4 12.8c2.4 2.4 5.6 3.2 8.8 3.2h4c3.2 0 6.4-1.6 8-4l8-12.8C91.2 37.6 84 40 72 40z"/>
        </svg>
      )
    case 'SQLSERVER':
    case 'MS':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* Microsoft SQL Server Grid Logo */}
          <rect fill="#CC2927" x="12" y="12" width="48" height="48" rx="8"/>
          <rect fill="#CC2927" x="68" y="12" width="48" height="48" rx="8"/>
          <rect fill="#CC2927" x="12" y="68" width="48" height="48" rx="8"/>
          <rect fill="#CC2927" x="68" y="68" width="48" height="48" rx="8"/>
        </svg>
      )
    case 'SQLITE':
    case 'SL':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* Official SQLite Blue Cylinder Logo */}
          <ellipse cx="64" cy="32" rx="48" ry="20" fill="#0F80CC"/>
          <path fill="#0F80CC" d="M16 32v64c0 11.046 21.492 20 48 20s48-8.954 48-20V32H16z"/>
          <ellipse cx="64" cy="32" rx="40" ry="14" fill="#60A5FA"/>
        </svg>
      )
    case 'MARIADB':
    case 'MA':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* Official MariaDB Seal Logo */}
          <circle cx="64" cy="64" r="52" fill="#003545"/>
          <path fill="#FFFFFF" d="M44 40h12v48H44V40zm28 0h12v48H72V40z"/>
          <circle cx="64" cy="32" r="6" fill="#F29111"/>
        </svg>
      )
    case 'COCKROACHDB':
    case 'CR':
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Official CockroachDB Hexagon Logo */}
          <rect width="100" height="100" rx="22" fill="#6933FF"/>
          <path d="M50 16L18 34.5v31L50 84l32-18.5v-31L50 16z" fill="#FFFFFF"/>
          <path d="M50 32L32 42.5v21L50 74l18-10.5v-21L50 32z" fill="#6933FF"/>
        </svg>
      )
    case 'MONGODB':
    case 'MO':
    case 'MONGODB ATLAS':
    case 'AT':
      return (
        <svg className={className} viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          {/* Official MongoDB Leaf Logo */}
          <path fill="#47A248" d="M64 8s-32 41.6-32 76.8c0 19.44 14.336 35.2 32 35.2s32-15.76 32-35.2C96 49.6 64 8 64 8z"/>
          <path fill="#499D4A" d="M64 8v112c14.336 0 26.24-12.8 26.24-28.8C90.24 59.2 64 8 64 8z"/>
          <path fill="#13AA52" d="M61.44 121.6c1.408 0 2.56-1.152 2.56-2.56V8s-32 41.6-32 76.8c0 19.44 13.184 35.2 29.44 35.2z"/>
        </svg>
      )
    default:
      return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#6366F1"/>
          <path d="M30 50h40M50 30v40" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"/>
        </svg>
      )
  }
}
