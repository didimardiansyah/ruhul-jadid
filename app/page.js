import Link from "next/link";

const quickMenus = [
  {
    title: "Pembayaran Iuran",
    desc: "Cek status iuran, lihat siapa yang sudah lunas, dan catat pembayaran baru.",
    href: "/pembayaran",
    color: "from-emerald-400/20 to-emerald-500/10",
    icon: "💰",
  },
  {
    title: "Jadwal Piket",
    desc: "Atur giliran bersih-bersih mingguan agar area kos tetap nyaman.",
    href: "/jadwal",
    color: "from-sky-400/20 to-sky-500/10",
    icon: "🧹",
  },
];

const highlightStats = [
  { label: "Jumlah Penghuni", value: "10 orang" },
  { label: "Iuran Bulanan", value: "Rp 65.000/orang" },
  { label: "Update Data", value: "Realtime via Supabase" },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-slate-950 p-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">
            Dashboard Kos
          </p>
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Sistem Informasi Kos yang rapi, cepat, dan mudah dipakai.
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Pantau pembayaran iuran, lihat status lunas, dan susun jadwal piket agar
            semua penghuni tinggal dengan nyaman. Dirancang untuk kebutuhan kos berisi
            10 orang dengan tampilan modern.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pembayaran"
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Mulai cek pembayaran
            </Link>
            <Link
              href="/jadwal"
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
            >
              Lihat jadwal piket
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {highlightStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {stat.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {quickMenus.map((menu) => (
          <Link
            key={menu.title}
            href={menu.href}
            className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${menu.color} p-6 transition hover:border-white/30 hover:bg-white/10`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{menu.icon}</span>
              <h3 className="text-lg font-semibold text-white">
                {menu.title}
              </h3>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {menu.desc}
            </p>
            <p className="mt-6 text-sm font-semibold text-indigo-200 transition group-hover:text-indigo-100">
              Buka halaman →
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 md:grid-cols-3">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Alur informasi</h3>
          <p className="text-sm text-slate-300">
            Data pembayaran dan jadwal tersimpan rapi, sehingga pengelola kos bisa
            melihat kondisi harian tanpa buka spreadsheet manual.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Status lunas</h3>
          <p className="text-sm text-slate-300">
            Setiap anggota otomatis terlihat apakah sudah lunas atau belum, lengkap
            dengan progress bar pencapaian iuran.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Jadwal piket</h3>
          <p className="text-sm text-slate-300">
            Giliran mingguan mudah diatur, menghindari bentrok, dan menjaga kebersihan
            bersama.
          </p>
        </div>
      </section>
    </div>
  );
}
