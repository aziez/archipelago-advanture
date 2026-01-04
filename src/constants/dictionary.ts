// src/constants/dictionary.ts

// 1. Definisikan Bahasa Default (Inggris) sebagai Master Type
const en = {
  nav: {
    home: 'Identity',
    projects: 'Discoveries',
    skills: 'Arsenal',
    contact: 'Uplink',
  },
  home: {
    role: 'FULL STACK EXPLORER',
    title: 'Mission Log',
    desc: "Ahoy! I'm a creative developer navigating the digital ocean. My compass points towards interactive web experiences.",
    stats: {
      creativity: 'Creativity',
      tech: 'Tech Stack',
      coffee: 'Caffeine Level',
    },
  },
  projects: {
    title: 'Featured Artifacts',
    subtitle: 'Collection of digital creations from the deep web.',
  },
  skills: {
    title: 'System Arsenal',
    frontend: 'Frontend Core',
    backend: 'Backend Ops',
  },
  contact: {
    title: 'Transmission',
    send: 'Initiate Uplink',
    success: 'Packet Sent Successfully',
  },
};

// 2. Definisikan Bahasa Indonesia (Struktur HARUS sama persis dengan en)
const id: typeof en = {
  nav: {
    home: 'Identitas',
    projects: 'Penemuan',
    skills: 'Senjata',
    contact: 'Koneksi',
  },
  home: {
    role: 'PENJELAJAH FULL STACK',
    title: 'Catatan Misi',
    desc: 'Ahoy! Saya pengembang kreatif yang mengarungi samudra digital. Kompas saya mengarah pada pengalaman web interaktif.',
    stats: {
      creativity: 'Kreativitas',
      tech: 'Teknologi',
      coffee: 'Kadar Kafein',
    },
  },
  projects: {
    title: 'Artefak Unggulan',
    subtitle: 'Koleksi kreasi digital dari kedalaman web.',
  },
  skills: {
    title: 'Gudang Senjata',
    frontend: 'Inti Frontend',
    backend: 'Operasi Backend',
  },
  contact: {
    title: 'Transmisi',
    send: 'Mulai Koneksi',
    success: 'Paket Berhasil Terkirim',
  },
};

// 3. Export Dictionary
export const DICTIONARY = { en, id };
export type Language = keyof typeof DICTIONARY;
