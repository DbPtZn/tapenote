/** 用于标记对象是否已经移除的枚举 */
export enum RemovedEnum {
  /** 未移除 */
  NEVER = 'never',
  /** 主动移除： 被用户指定移除的节点 */
  ACTIVE = 'active',
  /** 被动移除： 其父节点被移除，导致其被移除 */
  PASSIVE = 'passive'
}
