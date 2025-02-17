/**
 * @license Angles.js v0.2.4 08/04/2016
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * We have made some modifications here
 **/

var TAU = 2 * Math.PI;

// var DIRECTIONS = ["N", "E", "S", "W"];
var DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
// var DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];

/**
 * Mathematical modulo
 *
 * @param {number} x
 * @param {number} m
 * @returns {number}
 */
function mod(x, m) {
  return ((x % m) + m) % m;
}

export default {
  /**
   * Normalize an arbitrary angle to the interval [-180, 180)
   *
   * @param {number} n
   * @returns {number}
   */
  normalizeHalf: function (n) {
    var c = this['__SCALE'];
    var h = c / 2;

    return mod(n + h, c) - h;
  },
  /**
   * Normalize an arbitrary angle to the interval [0, 360)
   *
   * @param {number} n
   * @returns {number}
   */
  normalize: function (n) {
    var c = this['__SCALE'];

    return mod(n, c);
  },
  /**
   * Gets the shortest direction to rotate to another angle
   *
   * @param {number} from
   * @param {number} to
   * @returns {number}
   */
  shortestDirection: function (from, to) {
    var z = from - to;
    // mod(-z, 360) < mod(z, 360) <=> mod(z + 180, 360) < 180       , for all z \ 180

    if (from === to) {
      return 0;
      // if (mod(-z, 360) < mod(z, 360)) {
    } else if (this['normalizeHalf'](z) < 0) {
      return -1; // Left
    } else {
      return +1; // Right
    }
  },
  /**
   * Checks if an angle is between two other angles
   *
   * @param {number} n
   * @param {number} a
   * @param {number} b
   * @returns {boolean}
   */
  between: function (n, a, b) {
    // Check if an angle n is between a and b

    var c = this['__SCALE'];
    n = mod(n, c);
    a = mod(a, c);
    b = mod(b, c);

    if (a < b) return a <= n && n <= b;
    // return 0 <= n && n <= b || a <= n && n < 360;
    return a <= n || n <= b;
  },
  /**
   * Calculates the angular difference between two angles
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  diff: function (a, b) {
    return Math.abs(b - a) % this['__SCALE'];
  },
  /**
   * Calculate the minimal distance between two angles
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  distance: function (a, b) {
    // here are some modifications
    return Math.abs(this['normalizeHalf'](a - b));
  },
  /**
   * Calculate radians from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  toRad: function (n) {
    // https://en.wikipedia.org/wiki/Radian
    return n / this.__RAD_TO_SCALE;
  },
  /**
   * Calculate degrees from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  toDeg: function (n) {
    // https://en.wikipedia.org/wiki/Degree_(angle)
    return n / this.__DEG_TO_SCALE;
  },
  /**
   * Calculate gons from current angle
   *
   * @param {number} n
   * @returns {number}
   */
  toGon: function (n) {
    // https://en.wikipedia.org/wiki/Gradian
    return n / this.__GON_TO_SCALE;
  },
  /**
   * Given the sine and cosine of an angle, what is the original angle?
   *
   * @param {number} sin
   * @param {number} cos
   * @returns {number}
   */
  fromSinCos: function (sin, cos) {
    var s = this['__SCALE'];
    var angle = (1 + Math.acos(cos) / TAU) * s;

    if (sin < 0) {
      angle = s - angle;
    }
    return mod(angle, s);
  },
  /**
   * What is the angle of two points making a line
   *
   * @param {Array} p1
   * @param {Array} p2
   * @returns {number}
   */
  fromSlope: function (p1, p2) {
    var s = this['__SCALE'];
    var angle = (TAU + Math.atan2(p2[1] - p1[1], p2[0] - p1[0])) % TAU;

    return (angle / TAU) * s;
  },
  /**
   * Returns the quadrant
   *
   * @param {number} x The point x-coordinate
   * @param {number} y The point y-coordinate
   * @param {number=} k The optional number of regions in the coordinate-system
   * @param {number=} shift An optional angle to rotate the coordinate system
   * @returns {number}
   */
  quadrant: function (x, y, k = 4, shift = 0) {
    var s = this['__SCALE'];

    /* (shift = 180 / k), (k = 4), (s = 360):
     *   I) 45-135
     *  II) 135-225
     * III) 225-315
     *  IV) 315-405  or 315-45
     */

    /* (shift = 0), (k = 4), (s = 360):
     *   I) 0-90
     *  II) 90-180
     * III) 180-270
     *  IV) 270-360 or 270-0
     */

    var phi = (Math.atan2(y, x) + TAU) / TAU;

    if (Math.abs((phi * s) % (s / k)) < this['EPSILON']) {
      return 0;
    }

    return 1 + mod(Math.floor((k * shift) / s + k * phi), k);
  },
  /**
   * Calculates the compass direction of the given angle
   *
   * @param {number} course
   * @returns {string}
   */
  compass: function (course) {
    // 0° = N
    // 90° = E
    // 180° = S
    // 270° = W

    var s = this['__SCALE'];
    var k = DIRECTIONS.length;

    // floor((2ck + s) / (2s)) = round((c / s) * k)
    var dir = Math.round((course / s) * k);

    return DIRECTIONS[mod(dir, k)];
  },
  /**
   * Calculates the linear interpolation of two angles
   *
   * @param {number} a Angle one
   * @param {number} b Angle two
   * @param {number} p Percentage
   * @param {number} dir Direction (either 1 [=CW] or -1 [=CCW])
   * @returns {number}
   */
  lerp: function (a, b, p, dir) {
    var s = this['__SCALE'];
    a = mod(a, s);
    b = mod(b, s);

    if (a === b) return a;

    // dir becomes an offset if we have to add a full revolution (=scale)
    if (!dir) dir = -s;
    else if ((dir === 1) === a < b) dir *= s;
    else dir = 0;

    return mod(a + p * (b - a - dir), s);
  },
  /**
   * Calculates the average (mean) angle of an array of angles
   *
   * @param {array} angles Angle array
   * @returns {number}
   */
  average: function (angles) {
    var s = this['__SCALE'];

    // Basically treat each angle as a vector, add all the vecotrs up,
    // and return the angle of the resultant vector.

    var y = angles.map((a) => Math.sin((a * TAU) / s)).reduce((a, b) => a + b);
    var x = angles.map((a) => Math.cos((a * TAU) / s)).reduce((a, b) => a + b);

    // If the resultant vector is very short, this means the average angle is likely wrong or ambiguous.
    // For instance, what if a users asks for the average of the angles [0, PI]?

    // TODO: Warn user (or return undefined / null / NaN) when using opposite angles
    // Could be as simple as:
    //if (x * x + y * y < EPS * EPS) return NaN;

    return (Math.atan2(y, x) * s) / TAU;
  },
};
