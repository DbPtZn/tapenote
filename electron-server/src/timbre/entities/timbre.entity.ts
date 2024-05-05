interface RoleList {
  key: number
  value: { name: string; avatar: string; changer: number }
}
interface RobotList {
  key: number
  value: { name: string; avatar: string }
}

export class Timbre {
  _id: string

  userId: string // 用户 id

  role: number // 常用角色

  robot: number // 常用语音角色

  roleList: RoleList[] // 扮演角色列表

  robotList: RobotList[] // 合成语音列表
}
