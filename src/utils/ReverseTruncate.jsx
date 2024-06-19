export const ReverseTruncate = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return "..." + str.slice(-(maxLength - 3));
};
