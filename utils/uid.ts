export const generateUid = (digit: number = 10): string => {
  return Array.from({ length: digit }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
};
