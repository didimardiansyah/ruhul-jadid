import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistem Informasi Kos Ruhul Jadid",
  description: "Dashboard sederhana untuk jadwal piket dan pembayaran kos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Sistem Informasi Kos
                </p>
                <h1 className="text-lg font-semibold text-white">
                  Rumah Kos Ruhul Jadid
                </h1>
              </div>
              <nav className="flex flex-wrap items-center gap-3 text-sm">
                <Link
                  href="/"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:bg-white/10"
                >
                  Beranda
                </Link>
                <Link
                  href="/pembayaran"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:bg-white/10"
                >
                  Pembayaran
                </Link>
                <Link
                  href="/jadwal"
                  className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:bg-white/10"
                >
                  Jadwal Piket
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-10">
            {children}
          </main>
          <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-400">
            Diperbarui otomatis setiap transaksi • Tetap rapi, tetap nyaman
          </footer>
        </div>
      </body>
    </html>
  );
}
