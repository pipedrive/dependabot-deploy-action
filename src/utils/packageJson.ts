import { join } from 'path';
import fs from 'fs';

export interface PackageJSON {
  devDependencies?: { [key: string]: string };
  dependencies?: { [key: string]: string };
}

const getPath = () => join(process.env.GITHUB_WORKSPACE, 'package.json').toString();

const getPackageJson = () => JSON.parse(fs.readFileSync(getPath()).toString()) as PackageJSON;

export const isInProdDependencies = (packageName: string) => {
  const { dependencies } = getPackageJson();

  const isInProd = dependencies && packageName in dependencies;
  return isInProd ?? false;
};

export const isInAnyDependencies = (packageName: string) => {
  const { devDependencies, dependencies } = getPackageJson();

  const isInDev = devDependencies && packageName in devDependencies;
  const isInProd = dependencies && packageName in dependencies;
  return (isInDev || isInProd) ?? false;
};
