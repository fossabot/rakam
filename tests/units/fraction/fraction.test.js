const {
  frac,
  rndi,
  rnd,
} = require('rakam');

let tests = [
  {
    fn: frac.qr,
    args: [-1.123],
    expected: { s: -1, q: 1, r: 123, d: 1000 },
  },
  {
    fn: frac.qr,
    args: [50.1],
    expected: { s: 1, q: 50, r: 1, d: 10 },
  },
];

test('aliases should refer to the original name', () => {
  expect(frac.qr).toBe(frac.quotRem);
  expect(frac.frac).toBe(frac.fraction);
});

describe('qutoRem method', () => {

  tests.forEach((t) => {
    test(t.title || t.fn.name + ': ' + t.args, () => {
      expect(t.fn(...t.args)).toStrictEqual(t.expected);
    });
  });

  test('quotRem: integer has n = 0, d = 1 and q = the original number', () => {
    for (let i = 0; i < 20; i++) {
      let number = rndi(-100, 100);
      let qr = frac.qr(number);
      expect(qr).toStrictEqual({
        s: Math.sign(number) < 0 ? -1 : 1,
        q: Math.sign(number) * number, // abs
        r: 0,
        d: 1,
      });
    }
  });

  test('frac: process the output of qutoRem and return { n, d, s }', () => {
    for (let i = 0; i < 20; i++) {
      let number = rnd(-100, 100);
      let v = frac.frac(frac.qr(number));
      let e = frac.frac(number);
      // if (Object.values(v).filter(v => Object.values(e).indexOf(v) > -1).length < Object.values(v).length) console.log("number>>>>>>>>>>>>>>>>>", number);
      expect(v).toStrictEqual(e);
    }
  });
});
