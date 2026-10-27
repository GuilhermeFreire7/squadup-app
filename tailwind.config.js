/** @type {import('tailwindcss').Config} */
// Tokens documentados em `.status/design-tokens.md`. Espelhar mudanças de cor em `src/theme/index.ts`.
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary — Electric Blue: ações e elementos interativos
        primary: {
          50:  "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA", // ativo sobre fundo escuro (tab bar, slogan)
          500: "#2563EB", // main brand — botões, links, foco
          600: "#1D4ED8", // pressionado
          700: "#1E40AF", // texto sobre primary-50/100
          800: "#1E3A8A",
          900: "#1E2D5A",
        },
        // Secondary — Slate: a única escala de cinza do app (texto, bordas, superfícies)
        //   900 texto principal · 600 texto de apoio · 500 legenda (mínimo AA sobre claro)
        //   400 só sobre fundo escuro ou ícone decorativo · 200 borda · 100 divisória · 50 fundo
        secondary: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Accent — Energetic Orange: só destaque pontual (badges, energia). Nunca em botão
        // nem como fundo de texto branco; texto laranja usa 700 sobre 50/100.
        accent: {
          50:  "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        // Semânticas — só para estado. 50 = fundo, DEFAULT/500 = ícone e preenchimento,
        // 700 = texto (AA sobre branco e sobre o próprio 50).
        success: {
          DEFAULT: "#22C55E",
          50:  "#F0FDF4",
          500: "#22C55E",
          700: "#15803D",
        },
        warning: {
          DEFAULT: "#F59E0B",
          50:  "#FFFBEB",
          500: "#F59E0B",
          700: "#B45309",
        },
        error: {
          DEFAULT: "#DC2626", // AA como texto sobre branco e com texto branco por cima
          50:  "#FEF2F2",
          600: "#DC2626",
          700: "#B91C1C",
        },
        // Cor de categoria do esporte para TEXTO (tons 700, AA sobre o fundo do tile).
        // Ícones usam o tom mais vivo de `SPORT_META[sport].color`.
        sport: {
          football:   "#047857",
          futsal:     "#0F766E",
          volleyball: "#6D28D9",
          basketball: "#C2410C",
          tennis:     "#4D7C0F",
          other:      "#475569",
          "football-bg":   "#ECFDF5",
          "futsal-bg":     "#F0FDFA",
          "volleyball-bg": "#F5F3FF",
          "basketball-bg": "#FFF7ED",
          "tennis-bg":     "#F7FEE7",
          "other-bg":      "#F1F5F9",
        },
      },
      fontFamily: {
        sans:   ["System"],
        mono:   ["Courier"],
      },
      fontSize: {
        // Escala semântica — preferir estes tokens em código novo.
        // O peso vem embutido; `font-*` depois do token sobrescreve quando preciso.
        display:    ["30px", { lineHeight: "36px", fontWeight: "700", letterSpacing: "-0.5px" }],
        title:      ["24px", { lineHeight: "30px", fontWeight: "700", letterSpacing: "-0.3px" }],
        heading:    ["18px", { lineHeight: "24px", fontWeight: "700" }],
        subheading: ["16px", { lineHeight: "22px", fontWeight: "600" }],
        body:       ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm":  ["14px", { lineHeight: "20px", fontWeight: "400" }],
        label:      ["14px", { lineHeight: "20px", fontWeight: "600" }],
        caption:    ["12px", { lineHeight: "16px", fontWeight: "500" }],
        overline:   ["12px", { lineHeight: "16px", fontWeight: "700", letterSpacing: "0.5px" }],
        // Escala primitiva — mantida para casos pontuais (ex.: tamanhos de avatar)
        xs:   ["12px", { lineHeight: "16px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg:   ["18px", { lineHeight: "28px" }],
        xl:   ["20px", { lineHeight: "28px" }],
        "2xl":["24px", { lineHeight: "32px" }],
        "3xl":["30px", { lineHeight: "36px" }],
        "4xl":["36px", { lineHeight: "40px" }],
      },
      // Base 4. Meios-passos (0.5) só para ajustes de 2px.
      spacing: {
        px:  "1px",
        0:   "0px",
        0.5: "2px",
        1:   "4px",
        1.5: "6px",
        2:   "8px",
        2.5: "10px",
        3:   "12px",
        4:   "16px",
        5:   "20px", // margem lateral das telas
        6:   "24px",
        7:   "28px",
        8:   "32px",
        9:   "36px",
        10:  "40px",
        11:  "44px", // área de toque mínima
        12:  "48px",
        14:  "56px",
        16:  "64px",
        20:  "80px",
        24:  "96px",
      },
      // Três papéis: `control` (botões, inputs, tiles, avisos), `card` (cards, painéis)
      // e `full` (chips, badges, avatares, botões só de ícone).
      borderRadius: {
        none:    "0px",
        control: "12px",
        card:    "16px",
        full:    "9999px",
        sm:   "4px",
        DEFAULT: "8px",
        md:   "8px",
        lg:   "12px",
        xl:   "16px",
        "2xl":"20px",
        "3xl":"28px",
      },
      // React Native não suporta letterSpacing em `em` — valores em px
      letterSpacing: {
        tighter: "-0.5px",
        tight: "-0.3px",
        normal: "0px",
        wide: "0.5px",
        wider: "1px",
      },
    },
  },
  plugins: [],
};
