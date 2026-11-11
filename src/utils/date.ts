const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function formatMatchDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return `${DAYS[date.getDay()]}, ${day} ${MONTHS[month - 1]}`;
}

/** Insere "/" automaticamente enquanto o usuário digita — teclado numérico não tem esse caractere. */
export function formatDateInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  let result = day;
  if (month) result += `/${month}`;
  if (year) result += `/${year}`;
  return result;
}

/**
 * Insere ":" automaticamente enquanto o usuário digita o horário (`2030` → `20:30`). O teclado
 * numérico do Android não tem ":", então sem a máscara o campo `HH:MM` era impossível de preencher.
 * O ":" só entra quando já há dígito de minuto, para o apagar funcionar naturalmente.
 */
export function formatTimeInput(text: string): string {
  const digits = text.replace(/\D/g, "").slice(0, 4);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);
  return minutes ? `${hours}:${minutes}` : hours;
}

/** Aceita `DD/MM/AAAA`; devolve `null` se o formato ou a data (ex.: 31/02) forem inválidos. */
export function parseBirthDate(input: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate ? date : null;
}

/** Formata um timestamp ISO (`created_at` do backend) para `HH:mm` em exibição de chat. */
export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const birthdayAlreadyHappenedThisYear =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
      referenceDate.getDate() >= birthDate.getDate());

  if (!birthdayAlreadyHappenedThisYear) age -= 1;
  return age;
}
