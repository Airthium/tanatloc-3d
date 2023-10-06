/**
 * To readable
 * @param number Number
 * @returns Readable number
 */
const toReadable = (number: number): string => {
  if (Math.abs(number) < 1e-12) return '0'
  if (Math.abs(number) < 0.001 || Math.abs(number) > 1000)
    return number.toExponential(2)
  return '' + parseFloat(number.toPrecision(3))
}

export default toReadable
