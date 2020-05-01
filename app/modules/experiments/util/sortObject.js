/* @flow */

const sortObject = (o: Object) => {
  let sorted = {};
  let key;
  let a = [];

  for (key in o) {
    if (Object.prototype.hasOwnProperty.call(o, key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
};

export default sortObject;
