import { getPackageNameFromTitle } from './getPackageNameFromTitle';

describe(getPackageNameFromTitle.name, () => {
  const validCases = [
    [
      'Bump @typescript-eslint/eslint-plugin from 2.28.0 to 2.30.0',
      '@typescript-eslint/eslint-plugin',
    ],
    ['Bump husky from 4.2.3 to 4.2.5', 'husky'],
    ['Bump @types/relay-test-utils from 6.0.1 to 6.0.2', '@types/relay-test-utils'],
  ];

  const invalidCases = ['Bump kafka', 'Bump from 1.0.0 to 1.0.1', 'Invalid title'];

  it.each(validCases)('should parse package name %s correctly', (title, expected) => {
    expect(getPackageNameFromTitle(title)).toBe(expected);
  });

  it.each(invalidCases)('should throw error for unexpected string %s', (title) => {
    expect(() => getPackageNameFromTitle(title)).toThrow(expect.any(Error));
  });
});
