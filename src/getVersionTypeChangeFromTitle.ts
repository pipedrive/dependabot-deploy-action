import { VersionType } from "./types";
import semver from 'semver-diff';

export const getVersionTypeChangeFromTitle = (title: string): VersionType => {
    const VERSIONS_REGEX = /[0-9.]+/g;
    const versions = title.match(VERSIONS_REGEX);
    if (versions.length !== 2) {
      throw new Error(`Expected two versions in PR title "${title}"`);
    }

    const [previous, next] = versions;

    const version = semver(previous, next);

    switch(version) {
      case 'patch':
        return 'PATCH';
      case 'minor':
        return 'MINOR';
      case 'major':
        return 'MAJOR';
      default:
        throw new Error(`Unexpected version change ${version} for title ${title}`);
    }

    
}