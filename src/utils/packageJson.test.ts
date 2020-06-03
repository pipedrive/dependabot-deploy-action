import { readFileSync } from 'fs';
import { isInAnyDependencies, isInProdDependencies, PackageJSON } from './packageJson';

const packageJson: PackageJSON = {
  dependencies: {
    'prod-only': '0.0.1',
    'both': '0.0.1',
  },
  devDependencies: {
    'dev-only': '0.0.1',
    'both': '0.0.1',
  },
};

const emptyPackageJson = {};

jest.mock('fs');

beforeEach(() => {
  const pathToGithubWorkspace = '/path/to/';
  process.env = {
    GITHUB_WORKSPACE: pathToGithubWorkspace,
  };

  (readFileSync as jest.Mock).mockImplementation((path) =>
    path === `${pathToGithubWorkspace}package.json` ? JSON.stringify(packageJson) : undefined,
  );
});

afterEach(() => {
  jest.resetModules();
});

describe(isInProdDependencies.name, () => {
  it('should return `true` if in dependencies', () => {
    const result = isInProdDependencies('prod-only');
    expect(result).toBe(true);
  });

  it('should return `true` if in both dependencies', () => {
    const result = isInProdDependencies('both');
    expect(result).toBe(true);
  });

  it('should return `false` if only in devDependencies', () => {
    const result = isInProdDependencies('dev-only');
    expect(result).toBe(false);
  });

  it('should return `false` if not anywhere', () => {
    const result = isInProdDependencies('nowhere');
    expect(result).toBe(false);
  });

  it('should return `false` if package.json have no dependencies', () => {
    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(emptyPackageJson));

    const result = isInProdDependencies('both');
    expect(result).toBe(false);
  });
});

describe(isInAnyDependencies.name, () => {
  it('should return `true` if in dependencies', () => {
    const result = isInAnyDependencies('prod-only');
    expect(result).toBe(true);
  });

  it('should return `true` if only in devDependencies', () => {
    const result = isInAnyDependencies('dev-only');
    expect(result).toBe(true);
  });

  it('should return `true` if in both dependencies', () => {
    const result = isInAnyDependencies('both');
    expect(result).toBe(true);
  });

  it('should return `false` if not anywhere', () => {
    const result = isInAnyDependencies('nowhere');
    expect(result).toBe(false);
  });

  it('should return `false` if package.json have no dependencies', () => {
    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(emptyPackageJson));

    const result = isInAnyDependencies('both');
    expect(result).toBe(false);
  });
});
