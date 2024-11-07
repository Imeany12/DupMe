export default function getFormattedDate(dateString: string): string {
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(
    new Date(dateString)
  );
}
