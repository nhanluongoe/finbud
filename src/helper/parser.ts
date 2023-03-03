export function parseAccountParams(params: string) {
  const paramSplits = params.split('&');
  const name = paramSplits[0];
  const balance = +paramSplits[1];

  return { name, balance };
}
