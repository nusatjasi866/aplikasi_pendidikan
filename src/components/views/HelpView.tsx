import React, { useState } from 'react';
import {
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import type { PortalSettings } from '../../shared/portalLogic';

interface HelpViewProps {
  settings: PortalSettings;
}

const FAQS = [
  {
    q: 'Bagaimana cara mengakses Info GTK atau Login PTK?',
    a: 'Klik kartu Info GTK atau Login PTK pada halaman Beranda, lalu klik tombol "Buka Aplikasi". Gunakan akun PTK yang sudah terintegrasi dengan Dapodik sekolah masing-masing.',
  },
  {
    q: 'Bagaimana operator sekolah menambahkan aplikasi daerah baru ke portal?',
    a: 'Pilih menu "Tambah Aplikasi" pada bilah navigasi kiri, isi nama aplikasi, tautan URL resmi (diawali https://), deskripsi singkat, kategori, dan pilih ikon yang sesuai lalu klik "Simpan Aplikasi".',
  },
  {
    q: 'Mengapa salah satu aplikasi bertanda Pemeliharaan?',
    a: 'Status Pemeliharaan menandakan server aplikasi pusat sedang dalam perbaikan atau pembaruan berkala. Anda tetap dapat melihat detail tautannya atau menghubungi helpdesk Dinas Pendidikan jika kendala berlangsung lama.',
  },
  {
    q: 'Siapa yang dapat dihubungi jika terjadi kendala sinkronisasi Dapodik atau Verval PTK/PD?',
    a: 'Silakan hubungi Tim Teknis Dapodik & Layanan Digital Dinas Pendidikan Kabupaten Kepulauan Tanimbar melalui nomor telepon atau email resmi yang tertera di halaman ini pada jam kerja (08.00 – 16.30 WIT).',
  },
];

export function HelpView({ settings }: HelpViewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="bg-white/95 rounded-2xl p-5 shadow-sm border border-white">
        <h2 className="text-xl font-extrabold text-slate-900">
          Pusat Bantuan & Panduan Portal
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Panduan penggunaan layanan digital pendidikan dan kontak resmi tim
          teknis {settings.regionName}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* FAQ Accordion */}
        <div className="lg:col-span-2 bg-white/95 rounded-2xl p-6 shadow-sm border border-white space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 mb-2">
            Pertanyaan yang Sering Diajukan
          </h3>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.q} className="bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Support Contact Card */}
        <div className="bg-white/95 rounded-2xl p-6 shadow-sm border border-white space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Helpdesk Dinas Pendidikan
              </h3>
              <p className="text-xs text-slate-500">
                Senin – Jumat, 08:00 – 16:30 {settings.timezone}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-sm text-slate-700">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span>{settings.supportPhone}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span className="break-all">{settings.supportEmail}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{settings.officeAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
