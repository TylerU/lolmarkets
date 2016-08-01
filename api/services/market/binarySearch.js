'use strict';

// Assumes positive numbers only (and 0)
exports.search = (fn, target) => {
  let input = 1;
  while (fn(input) <= target) {
    input = input * 2;
  }
  if (input === 1) return 0;
  let high = input;
  let low = input / 2;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (fn(mid) <= target && fn(mid + 1) > target) return mid;
    if (fn(mid) < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
};
