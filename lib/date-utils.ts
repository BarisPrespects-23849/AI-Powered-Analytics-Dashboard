export function format(date: Date, formatStr: string): string {
  const options: Intl.DateTimeFormatOptions = {}

  switch (formatStr) {
    case "PPP":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "PP":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    case "P":
      return date.toLocaleDateString("en-US")
    default:
      return date.toLocaleDateString("en-US")
  }
}
