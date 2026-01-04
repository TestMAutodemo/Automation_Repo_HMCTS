export function maskValueIfSensitive(tokenOrInput: string, value: string): string {
  const k = tokenOrInput.toLowerCase();

  if (
    k.includes("pass") ||
    k.includes("password") ||
    k.includes("secret") ||
    k.includes("token") ||
    k.includes("key")
  ) {
    return "********";
  }

  return value;
}