const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatBnNumber(num: number): string {
  return num.toLocaleString("en-US").replace(/\d/g, (d) => bnDigits[parseInt(d)]);
}