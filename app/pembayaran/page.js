"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const TARGET = 65000;

export default function Pembayaran() {
  const [anggota, setAnggota] = useState([]);
  const [pembayaran, setPembayaran] = useState([]);

  const [anggotaId, setAnggotaId] = useState("");
  const [nominal, setNominal] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAnggota = async () => {
    const { data } = await supabase
      .from("anggota")
      .select("*")
      .order("nama");

    setAnggota(data || []);
  };

  const loadPembayaran = async () => {
    const { data } = await supabase.from("pembayaran").select(`
        id,
        nominal,
        anggota_id,
        anggota:anggota_id (id, nama)
      `);

    setPembayaran(data || []);
  };

  useEffect(() => {
    loadAnggota();
    loadPembayaran();
  }, []);

  const tambah = async () => {
    if (!anggotaId || !nominal) return;

    setLoading(true);
    const { error } = await supabase.from("pembayaran").insert([
      {
        anggota_id: anggotaId,
        nominal: Number(nominal),
      },
    ]);

    if (!error) {
      await loadPembayaran();
      setNominal("");
      setAnggotaId("");
    }
    setLoading(false);
  };

  const hapus = async (id) => {
    await supabase.from("pembayaran").delete().eq("id", id);

    loadPembayaran();
  };

  const totalPerOrang = useMemo(() => {
    return anggota.map((a) => {
      const bayar = pembayaran
        .filter((p) => Number(p.anggota_id) === Number(a.id))
        .reduce((sum, p) => sum + Number(p.nominal), 0);

      return {
        ...a,
        total: bayar,
        persen: Math.min(Math.round((bayar / TARGET) * 100), 100),
      };
    });
  }, [anggota, pembayaran]);

  const ringkasan = useMemo(() => {
    const totalTerkumpul = pembayaran.reduce(
      (sum, p) => sum + Number(p.nominal),
      0
    );
    const totalTarget = anggota.length * TARGET;
    const sisa = Math.max(totalTarget - totalTerkumpul, 0);
    const persen = totalTarget
      ? Math.min(Math.round((totalTerkumpul / totalTarget) * 100), 100)
      : 0;

    return { totalTerkumpul, totalTarget, sisa, persen };
  }, [anggota.length, pembayaran]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Pembayaran Kos
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Pantau iuran dan status pembayaran
        </h2>
        <p className="text-sm text-slate-300">
          Catat pembayaran harian, lihat total terkumpul, serta siapa saja yang
          sudah lunas. Target iuran per orang: Rp {TARGET.toLocaleString("id-ID")}.
        </p>
      </div>

      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Total Terkumpul
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            Rp {ringkasan.totalTerkumpul.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Target Bulan Ini
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            Rp {ringkasan.totalTarget.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Sisa Tagihan
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            Rp {ringkasan.sisa.toLocaleString("id-ID")}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Progress
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            {ringkasan.persen}%
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{ width: `${ringkasan.persen}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Catat pembayaran</h3>
          <p className="mt-1 text-sm text-slate-400">
            Isi nama penghuni dan nominal yang dibayarkan.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Nama penghuni
              <select
                value={anggotaId}
                onChange={(e) => setAnggotaId(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white focus:border-indigo-400 focus:outline-none"
              >
                <option value="">Pilih anggota</option>
                {anggota.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-300">
              Nominal pembayaran
              <input
                type="number"
                placeholder="Contoh: 50000"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </label>

            <button
              onClick={tambah}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Tambah pembayaran"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Status per orang</h3>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {totalPerOrang.length} penghuni
            </span>
          </div>

          {totalPerOrang.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-400">
              Data anggota belum tersedia. Tambahkan data anggota di Supabase.
            </div>
          ) : (
            <div className="space-y-3">
              {totalPerOrang.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        {a.nama}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Rp {a.total.toLocaleString("id-ID")} / Rp
                        {TARGET.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.persen >= 100
                          ? "bg-emerald-400/20 text-emerald-200"
                          : "bg-amber-400/20 text-amber-200"
                      }`}
                    >
                      {a.persen >= 100 ? "Lunas" : "Belum"}
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-emerald-400"
                      style={{ width: `${a.persen}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Progress: {a.persen}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Riwayat pembayaran</h3>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
            {pembayaran.length} transaksi
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {pembayaran.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-400">
              Belum ada transaksi. Catat pembayaran pertama.
            </div>
          ) : (
            pembayaran.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-white">
                    {p.anggota?.nama ?? "Tidak diketahui"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Rp {Number(p.nominal).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => hapus(p.id)}
                  className="text-xs font-semibold text-rose-300 transition hover:text-rose-200"
                >
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
