"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Jadwal() {
  const [data, setData] = useState([]);
  const [minggu, setMinggu] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const { data } = await supabase
      .from("jadwal")
      .select("*")
      .order("minggu");

    setData(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const mingguTerakhir = useMemo(() => {
    if (!data.length) return "Belum ada";
    return `Minggu ke-${data[data.length - 1].minggu}`;
  }, [data]);

  const tambah = async () => {
    if (!minggu || !p1) return;

    setLoading(true);
    await supabase.from("jadwal").insert([
      {
        minggu,
        petugas1: p1,
        petugas2: p2,
      },
    ]);

    setMinggu("");
    setP1("");
    setP2("");
    await loadData();
    setLoading(false);
  };

  const hapus = async (id) => {
    await supabase.from("jadwal").delete().eq("id", id);
    loadData();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Jadwal Piket
        </p>
        <h2 className="text-3xl font-semibold text-white">
          Atur giliran bersih-bersih mingguan
        </h2>
        <p className="text-sm text-slate-300">
          Tambahkan petugas piket agar area kos tetap rapi. Data akan tersimpan dan
          bisa dihapus kapan saja.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Form jadwal baru</h3>
          <p className="mt-1 text-sm text-slate-400">
            Minggu terakhir: {mingguTerakhir}
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Minggu ke-
              <input
                type="number"
                placeholder="Contoh: 3"
                value={minggu}
                onChange={(e) => setMinggu(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Petugas utama
              <input
                placeholder="Nama petugas 1"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Petugas cadangan (opsional)
              <input
                placeholder="Nama petugas 2"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 p-3 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
              />
            </label>

            <button
              onClick={tambah}
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Menyimpan..." : "Tambah jadwal"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Daftar jadwal aktif
            </h3>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {data.length} jadwal
            </span>
          </div>

          {data.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-400">
              Belum ada jadwal. Tambahkan jadwal pertama untuk minggu ini.
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((j) => (
                <div
                  key={j.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Minggu ke-{j.minggu}</p>
                      <h4 className="text-base font-semibold text-white">
                        {j.petugas1}
                      </h4>
                      {j.petugas2 && (
                        <p className="text-sm text-slate-300">
                          Cadangan: {j.petugas2}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => hapus(j.id)}
                      className="text-xs font-semibold text-rose-300 transition hover:text-rose-200"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
