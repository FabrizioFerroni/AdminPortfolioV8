export function stripPdfExtension(name?: string): string {
  return name?.replace(/\.pdf$/i, '') ?? '';
}
