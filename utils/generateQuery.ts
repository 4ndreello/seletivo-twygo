export default function generateQuery(
  source: string,
  field: string,
  value: any
): string {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  return source + (source.includes("?") ? "&" : "?") + field + "=" + value;
}
