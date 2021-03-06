import environmentIsNode from 'detect-node';
import cmp from 'semver-compare';
import pkg from '../../package.json';
import type {
  RoarrGlobalState,
} from '../types';
import createNodeWriter from './createNodeWriter';

export default (currentState: any): RoarrGlobalState => {
  const versions = (currentState.versions || []).concat();

  versions.sort(cmp);

  const currentIsLatestVersion = !versions.length || cmp(pkg.version, versions[versions.length - 1]) === 1;

  if (!versions.includes(pkg.version)) {
    versions.push(pkg.version);
  }

  versions.sort(cmp);

  let newState = {
    sequence: 0,
    ...currentState,
    versions,
  };

  if (environmentIsNode && (currentIsLatestVersion || !newState.write)) {
    newState = {
      ...newState,
      ...createNodeWriter(),
    };
  }

  return newState;
};
