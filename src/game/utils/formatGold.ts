const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'] as const;

export function formatGold(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '0';
  if (value < 1_000) return Math.floor(value).toLocaleString('pt-BR');

  const tier = Math.min(Math.floor(Math.log10(value) / 3), SUFFIXES.length - 1);
  const scaled = value / 10 ** (tier * 3);
  const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;

  return `${scaled.toFixed(decimals)}${SUFFIXES[tier]}`;
}
