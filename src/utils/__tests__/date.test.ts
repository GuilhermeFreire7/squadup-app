import {
  calculateAge,
  formatDateInput,
  formatMessageTime,
  formatTimeInput,
  parseBirthDate,
} from "../date";

describe("formatTimeInput", () => {
  it("insere os dois-pontos automaticamente enquanto digita", () => {
    expect(formatTimeInput("2")).toBe("2");
    expect(formatTimeInput("20")).toBe("20");
    expect(formatTimeInput("203")).toBe("20:3");
    expect(formatTimeInput("2030")).toBe("20:30");
  });

  it("ignora tudo que não é dígito e limita a 4 dígitos", () => {
    expect(formatTimeInput("20h30")).toBe("20:30");
    expect(formatTimeInput("203099")).toBe("20:30");
  });

  it("é idempotente para um horário já formatado e permite apagar o ':'", () => {
    expect(formatTimeInput("09:00")).toBe("09:00");
    // apagar o último dígito de "20:3" deixa "20:" no campo → volta a "20"
    expect(formatTimeInput("20:")).toBe("20");
  });
});

describe("formatDateInput", () => {
  it("insere as barras automaticamente enquanto digita", () => {
    expect(formatDateInput("1")).toBe("1");
    expect(formatDateInput("15")).toBe("15");
    expect(formatDateInput("153")).toBe("15/3");
    expect(formatDateInput("1503")).toBe("15/03");
    expect(formatDateInput("150319")).toBe("15/03/19");
    expect(formatDateInput("15031990")).toBe("15/03/1990");
  });

  it("ignora tudo que não é dígito (teclado numérico não tem barra)", () => {
    expect(formatDateInput("15a03b1990")).toBe("15/03/1990");
  });

  it("é idempotente para um texto já formatado corretamente", () => {
    expect(formatDateInput("15/03/1990")).toBe("15/03/1990");
  });

  it("trunca em 8 dígitos (DDMMAAAA)", () => {
    expect(formatDateInput("1503199099")).toBe("15/03/1990");
  });

  it("string vazia continua vazia", () => {
    expect(formatDateInput("")).toBe("");
  });
});

describe("parseBirthDate", () => {
  it("converte DD/MM/AAAA válido em Date", () => {
    const date = parseBirthDate("15/03/1990");
    expect(date).toEqual(new Date(1990, 2, 15));
  });

  it("aceita espaços nas bordas", () => {
    expect(parseBirthDate("  15/03/1990  ")).toEqual(new Date(1990, 2, 15));
  });

  it("rejeita formato fora do padrão DD/MM/AAAA", () => {
    expect(parseBirthDate("1990-03-15")).toBeNull();
    expect(parseBirthDate("15/3/1990")).toBeNull();
    expect(parseBirthDate("")).toBeNull();
  });

  it("rejeita datas que não existem no calendário (ex.: 31 de fevereiro)", () => {
    expect(parseBirthDate("31/02/1990")).toBeNull();
  });

  it("rejeita 29 de fevereiro em ano não bissexto", () => {
    expect(parseBirthDate("29/02/1999")).toBeNull();
  });

  it("aceita 29 de fevereiro em ano bissexto", () => {
    expect(parseBirthDate("29/02/2000")).toEqual(new Date(2000, 1, 29));
  });
});

describe("calculateAge", () => {
  it("calcula a idade quando o aniversário já passou no ano de referência", () => {
    const birthDate = new Date(1990, 2, 15); // 15/03/1990
    const referenceDate = new Date(2026, 6, 8); // 08/07/2026
    expect(calculateAge(birthDate, referenceDate)).toBe(36);
  });

  it("ainda não soma o ano quando o aniversário cai depois da data de referência", () => {
    const birthDate = new Date(1990, 11, 25); // 25/12/1990
    const referenceDate = new Date(2026, 6, 8); // 08/07/2026
    expect(calculateAge(birthDate, referenceDate)).toBe(35);
  });

  it("soma o ano no próprio dia do aniversário", () => {
    const birthDate = new Date(1990, 6, 8); // 08/07/1990
    const referenceDate = new Date(2026, 6, 8); // 08/07/2026
    expect(calculateAge(birthDate, referenceDate)).toBe(36);
  });

  it("usa a data atual como referência por padrão", () => {
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    expect(calculateAge(eighteenYearsAgo)).toBe(18);
  });
});

describe("formatMessageTime", () => {
  it("formata um timestamp ISO em HH:mm", () => {
    const iso = new Date(2026, 6, 8, 9, 5).toISOString();
    expect(formatMessageTime(iso)).toMatch(/^\d{2}:\d{2}$/);
  });

  it("preserva a hora e o minuto do timestamp local", () => {
    const date = new Date(2026, 6, 8, 14, 30);
    expect(formatMessageTime(date.toISOString())).toBe(
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  });
});
