
export function generateRandomString(length = 6) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let randomString = ''
  const values = new Uint32Array(length)

  window.crypto.getRandomValues(values)

  for (let i = 0; i < length; i++) {
    randomString += charset[values[i] % charset.length]
  }

  return randomString
}
