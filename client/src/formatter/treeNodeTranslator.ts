import { TreeNode } from "@/store"

/** 将文件夹数据转化成符合 TreeNode 格式 */

export function treeNodeTranslator(data: any): TreeNode {
  return {
    key: data._id || data.id,
    id: data._id || data.id,
    parentId: data.parentId,
    label: data.name,
    isCloud: data.isCloud,
    createAt: data.createAt,
    lib: data.lib,
    isLeaf: data.isLeaf,
    // 拖拽节点时，只有 [] 才能触发 inside，所以子叶节点需要给与 children = []
    children: data.isLeaf ? [] : undefined
  }
}