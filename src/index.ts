import core from './core/';
import engine from './engine/';
import geometry from './geometry/';
import error from './errors/';

import vector from './vector';
import matrix from './matrix';

import version from './version.js';

export default {
  core,
  ...core,
  // make sure the API's identifiers are unique

  engine,

  geometry,

  error,

  vector,
  matrix,

  version,
};
