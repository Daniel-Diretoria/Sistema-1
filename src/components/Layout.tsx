/* Layout Component - Global layout structure with centered container, subtle gradient, geometric pattern and footer */

import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-gradient-to-br from-[#F5F7FA] via-[#EEF2F6] to-[#E8EDF2] text-[#1F2937]">
      {/* Subtle geometric pattern overlay: visible on tablet/desktop, hidden on mobile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden sm:block opacity-[0.45] transition-opacity"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 118, 110, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 118, 110, 0.05) 1px, transparent 1px),
            radial-gradient(circle 500px at 50% 20%, rgba(15, 118, 110, 0.08), transparent 70%),
            radial-gradient(circle 400px at 85% 85%, rgba(15, 118, 110, 0.04), transparent 60%)
          `,
          backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
        }}
      />

      {/* Main Content Area - Centered vertically & horizontally */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Footer fixed at the bottom: 12px light gray */}
      <footer className="relative z-10 w-full py-4 px-4 sm:px-6 text-center text-xs text-[#6B7280]">
        <p className="tracking-wide">© 2024 Diretoria Promoções — Acesso Restrito</p>
      </footer>
    </div>
  )
}
