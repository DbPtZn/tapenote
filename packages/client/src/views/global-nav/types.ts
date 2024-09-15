import { UserState } from "@/store"
import { Component } from "vue"

export interface UserOption extends UserState {
  key: string
  defaultIcon: Component
  onClick: (key: UserOption) => void
}

export interface GlobalOption {
  id: string
  label: string
  icon: string
  onClick?: (ev: MouseEvent) => void
}