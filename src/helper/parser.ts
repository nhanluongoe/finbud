export function parseAccountParams(params: string) {
  const paramSplits = params.split('&');
  const name = paramSplits[0];
  const balance = +paramSplits[1];

  return { name, balance };
}

export function parseParams(paramString: string) {
  const params = paramString.split('&');
  const res: Record<string, string> = {};

  for (const param of params) {
    const [key, value] = param.split('=');
    res[key] = value;
  }

  return res;
}
