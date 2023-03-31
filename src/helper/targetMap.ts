const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// export function mapTarget(id: string, map: Map<string, string>) {
//   return null;
// }

export function mapId(id: number) {
  const baseId = id + 1;

  const base = chars.length;
  let remainingId = baseId - 1;
  let mappedString = '';

  do {
    const index = remainingId % base;
    mappedString += chars[index];
    remainingId = Math.floor(remainingId / base);
  } while (remainingId > 0);

  return mappedString;
}

export function retrieveId(mappedId: string, map: Map<number, string>) {
  const keys = Array.from(map.keys());

  const key = keys.find((key) => map.get(key) === mappedId.trim());

  return key;
}
