export function remapInternationalCharToAscii(c: string): string {
  const s = c.toLowerCase();
  if ('àåáâäãåą'.includes(s)) return 'a';
  if ('èéêëę'.includes(s)) return 'e';
  if ('ìíîïı'.includes(s)) return 'i';
  if ('òóôõöøőð'.includes(s)) return 'o';
  if ('ùúûüŭů'.includes(s)) return 'u';
  if ('çćčĉ'.includes(s)) return 'c';
  if ('żźž'.includes(s)) return 'z';
  if ('śşšŝ'.includes(s)) return 's';
  if ('ñń'.includes(s)) return 'n';
  if ('ýÿ'.includes(s)) return 'y';
  if ('ğĝ'.includes(s)) return 'g';
  if (c === 'ř') return 'r';
  if (c === 'ł') return 'l';
  if (c === 'đ') return 'd';
  if (c === 'ß') return 'ss';
  if (c === 'Þ') return 'th';
  if (c === 'ĥ') return 'h';
  if (c === 'ĵ') return 'j';
  return '';
}

export function generateSlug(title: string): string {
  if (!title) return '';

  const maxLen = 80;
  let result = '';
  let prevDash = false;

  for (let i = 0; i < title.length && i <= maxLen; i++) {
    const c = title[i];
    const code = c.charCodeAt(0);

    if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      result += c;
      prevDash = false;
    } else if (c >= 'A' && c <= 'Z') {
      result += c.toLowerCase();
      prevDash = false;
    } else if ([' ', ',', '.', '/', '\\', '-', '_', '='].includes(c)) {
      if (!prevDash && result.length > 0) {
        result += '-';
        prevDash = true;
      }
    } else if (code >= 128) {
      const prevLen = result.length;
      result += remapInternationalCharToAscii(c);
      if (result.length !== prevLen) prevDash = false;
    }
  }

  return prevDash ? result.slice(0, -1) : result;
}
