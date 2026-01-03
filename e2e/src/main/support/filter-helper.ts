export function extractFromTex(text: string, char: string): string | null {
  // Split the text by '=' character
  const parts = text.split(char)[1]?.trim();

  if (parts) {
    console.log(`Filtered text is ${parts}`);
    return parts;
  } else {
    return null;
  }
}
