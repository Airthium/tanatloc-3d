/**
 * Sign
 * @param number Number
 * @returns Sign
 */
const sign = (number: number): -1 | 1 => {
  if (number < 0) return -1
  return 1
}

export default sign
