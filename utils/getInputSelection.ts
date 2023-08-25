export const getInputSelection = (e: Event): string | null => {
  const input = e.target as HTMLInputElement;
  if (
    input.selectionStart &&
    input.selectionEnd &&
    input.selectionStart !== input.selectionEnd
  ) {
    const selectedText = input.value.substring(
      input.selectionStart,
      input.selectionEnd
    );
    return selectedText;
  }
  return null;
};
