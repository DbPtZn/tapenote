interface option {
  key: string,
  label: string,
  avatar: string,
}

export function useLoginState() {
  // const userMap = new Map<{}, string>([])
  const userOptions: option[] = []
  Object.keys(sessionStorage).forEach(key => {
    // const value = sessionStorage[key]
    console.log(key.substring(0, 5))
    const prefix = key.substring(0, 5)
    if (prefix === 'User:') {
      // const suffix = key.substring(5)
      // const arr = suffix.split('&')
      // const account = arr[0]
      // const hostname = arr[1]
      // localStorage.getItem(`User:${account}&${hostname}`)
      const userInfoStr = localStorage.getItem(key)
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        const option: option = {
          key: key,
          label: userInfo.nickname,
          avatar: userInfo.avatar,
        }
        userOptions.push(option)
      }
    }
  });
  console.log(userOptions)
  return userOptions
}