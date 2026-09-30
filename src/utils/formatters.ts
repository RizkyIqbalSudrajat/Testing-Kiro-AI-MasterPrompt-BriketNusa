export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAngka(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatBerat(kg: number): string {
  if (kg >= 1000) {
    const ton = kg / 1000;
    return `${ton.toLocaleString('id-ID', { maximumFractionDigits: 2 })} Ton (${formatAngka(kg)} kg)`;
  }
  return `${formatAngka(kg)} kg`;
}

export function formatTanggal(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}
