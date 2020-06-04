export const getPackageNameFromTitle = (title: string): string => {
  const matched = title.match(/Bump (.*?) from/);
  if (!matched || !matched[1]) {
    throw new Error(`Package name could not be parsed from title ${title} by the regex`);
  }

  return matched[1].trim();
};
