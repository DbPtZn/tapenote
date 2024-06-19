import { User } from '~/models'

export default defineEventHandler(async event => {
  // try {
  //   // const user = await User.create({ data: { name: 'John Doe', email: 'john@example.com' } })
  //   // console.log(user)
  // } catch (error) {
  //   console.log(error)
  //   throw error
  // }
  return {
    hello: 'world'
  }
})
