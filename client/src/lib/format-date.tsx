export function formatDate(value: string | Date): string {
  const date =
    value instanceof Date
      ? value
      : new Date(
          value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value)
            ? value
            : `${value}Z`,
        );

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diff = Date.now() - date.getTime();

  if (diff < 0) {
    return "Just now";
  }

  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
}