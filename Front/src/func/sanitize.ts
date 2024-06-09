export function sanitize(text: unknown) {
  return String(text)
    .replaceAll('_', '')
    .replaceAll('/', '')
    .replaceAll('.', '')
    .replaceAll('-', '')
}
