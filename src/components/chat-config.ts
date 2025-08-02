export type ModeKey =
  | "kalenderakademik"
  | "marketing-management"
  | "macroeconomics"
  | "supply-chain"
  | "_default";

export const MODE_COPY: Record<ModeKey, { welcome: string; examples: string[] }> = {
  kalenderakademik: {
    welcome: [
      "Selamat datang di asisten Kalender Akademik!",
      "",
      "Tanyakan jadwal penting: libur, UTS/UAS, KRS, dan tenggat akademik.",
      "",
      "Ketik pertanyaan Anda untuk mulai.",
    ].join("\n"),
    examples: [
      "Kapan periode KRS semester ini?",
      "Tanggal UTS dan UAS kapan?",
      "Apakah ada libur nasional di bulan ini?",
      "Batas pembayaran UKT kapan?",
    ],
  },
  "marketing-management": {
    welcome: [
      "Welcome to Marketing Management Assistant.",
      "",
      "I can help with STP, 4Ps/7Ps, funnels, positioning, and campaign analysis.",
      "",
      "Ask anything to begin.",
    ].join("\n"),
    examples: [
      "Bantu susun STP untuk produk minuman kesehatan.",
      "Apa strategi 4P untuk kampanye peluncuran aplikasi?",
      "Contoh KPI untuk funnel akuisisi pengguna.",
      "Bagaimana positioning dibanding kompetitor utama?",
    ],
  },
  macroeconomics: {
    welcome: [
      "Welcome to Macroeconomics Study Assistant.",
      "",
      "Discuss GDP, inflation, unemployment, monetary/fiscal policy, IS-LM, AS-AD, and more.",
      "",
      "Send a prompt to get started.",
    ].join("\n"),
    examples: [
      "Jelaskan perbedaan CPI dan PPI.",
      "Bagaimana kebijakan moneter menekan inflasi?",
      "Ringkas model IS-LM secara singkat.",
      "Apa dampak fiskal ekspansif terhadap GDP?",
    ],
  },
  "supply-chain": {
    welcome: [
      "Welcome to Supply Chain Assistant.",
      "",
      "I can help with procurement, inventory, logistics, forecasting, and network design.",
      "",
      "Ask a question to start.",
    ].join("\n"),
    examples: [
      "Cara menentukan safety stock sederhana?",
      "Bandingkan EOQ vs JIT secara singkat.",
      "Strategi optimasi rute distribusi dasar.",
      "Metode forecasting yang cocok untuk musiman?",
    ],
  },
  _default: {
    welcome: ["Welcome! I’m your assistant.", "", "Ask me anything to get started."].join("\n"),
    examples: [
      "Apa yang bisa kamu bantu?",
      "Berikan contoh ringkasan topik populer.",
      "Bagaimana cara kerja asisten ini?",
      "Tunjukkan contoh langkah-langkah pemecahan masalah.",
    ],
  },
};

export const getModeCopy = (mode: string) => {
  return MODE_COPY[(mode as ModeKey) in MODE_COPY ? (mode as ModeKey) : "_default"];
};

export const resolveBotKey = (mode: string) => {
  switch (mode) {
    case "kalenderakademik":
      return "HTQdMJDA";
    case "marketing-management":
      return "qmgRnljt";
    case "macroeconomics":
      return "KLDDElGB";
    case "supply-chain":
      return "mpIozNNe";
    default:
      return "mAdnKOee";
  }
};