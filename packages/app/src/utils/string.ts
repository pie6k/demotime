export function normalizeString(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace('ł', 'l');
}

export function getSearchString(input: string) {
  return normalizeString(input).toLowerCase().trim();
}
