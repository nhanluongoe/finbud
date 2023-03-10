export function toCurrency(amount: number) {
  return new Intl.NumberFormat().format(amount);
}
