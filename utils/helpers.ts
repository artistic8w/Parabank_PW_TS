export function parseCurrency(text: string): number {
  const value = Number.parseFloat(text.replace(/[^0-9.-]/g, ''));
  if (Number.isNaN(value)) {
    throw new Error(`Could not parse currency from "${text}"`);
  }
  return value;
}