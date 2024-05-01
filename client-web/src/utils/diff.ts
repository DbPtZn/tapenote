/** is diff */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDiff(source: any, target: any) {
  if (source === target) {
    return false
  }
  return true
}
