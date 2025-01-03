import { ComponentLoader } from '@textbus/platform-browser'
import {
  alertComponent,
  alertComponentLoader,
  animeComponent,
  animeComponentLoader,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  blockquoteComponent,
  blockquoteComponentLoader,
  dividerComponent,
  dividerComponentLoader,
  headingComponent,
  headingComponentLoader,
  imageB2UComponent,
  imageB2UComponentLoader,
  imageCardComponent,
  imageCardComponentLoader,
  jumbotronComponent,
  jumbotronComponentLoader,
  listComponent,
  listComponentLoader,
  paragraphComponent,
  paragraphComponentLoader,
  preComponent,
  preComponentLoader,
  stepComponent,
  stepComponentLoader,
  tableComponent,
  tableComponentLoader,
  timelineComponent,
  timelineComponentLoader,
  todolistComponent,
  todolistComponentLoader,
  wordExplainComponent,
  wordExplainComponentLoader
} from './components'
import {
  katexComponentLoader,
  audioComponentLoader,
  blockComponentLoader,
  videoComponentLoader,
  audioComponent,
  blockComponent,
  katexComponent,
  videoComponent,
  imageComponentLoader,
  imageComponent
} from '@textbus/editor'
import { Component } from '@textbus/core'
import { codeComponentLoader, codeComponent } from './components/code.component'

export const defaultComponentLoaders: ComponentLoader[] = [
  imageCardComponentLoader,
  todolistComponentLoader,
  katexComponentLoader,
  wordExplainComponentLoader,
  timelineComponentLoader,
  stepComponentLoader,
  alertComponentLoader,
  jumbotronComponentLoader,
  audioComponentLoader,
  blockquoteComponentLoader,
  blockComponentLoader,
  headingComponentLoader,
  imageB2UComponentLoader,
  listComponentLoader,
  paragraphComponentLoader,
  preComponentLoader,
  tableComponentLoader,
  videoComponentLoader,
  dividerComponentLoader,
  animeIgnoreComponentLoader,
  animeComponentLoader,
  // codeComponentLoader
]

export const defaultComponents: Component[] = [
  audioComponent,
  blockComponent,
  blockquoteComponent,
  headingComponent,
  imageB2UComponent,
  listComponent,
  paragraphComponent,
  preComponent,
  tableComponent,
  videoComponent,
  imageCardComponent,
  todolistComponent,
  katexComponent,
  wordExplainComponent,
  timelineComponent,
  stepComponent,
  alertComponent,
  jumbotronComponent,
  dividerComponent,
  animeIgnoreComponent,
  animeComponent,
  // codeComponent
]


export const defaultPlayerComponentLoaders: ComponentLoader[] = [
  imageCardComponentLoader,
  todolistComponentLoader,
  katexComponentLoader,
  wordExplainComponentLoader,
  timelineComponentLoader,
  stepComponentLoader,
  alertComponentLoader,
  jumbotronComponentLoader,
  audioComponentLoader,
  blockquoteComponentLoader,
  blockComponentLoader,
  headingComponentLoader,
  imageComponentLoader,
  listComponentLoader,
  paragraphComponentLoader,
  preComponentLoader,
  tableComponentLoader,
  videoComponentLoader,
  dividerComponentLoader,
  animeIgnoreComponentLoader,
  animeComponentLoader,
]

export const defaultPlayerComponents: Component[] = [
  audioComponent,
  blockComponent,
  blockquoteComponent,
  headingComponent,
  imageComponent,
  listComponent,
  paragraphComponent,
  preComponent,
  tableComponent,
  videoComponent,
  imageCardComponent,
  todolistComponent,
  katexComponent,
  wordExplainComponent,
  timelineComponent,
  stepComponent,
  alertComponent,
  jumbotronComponent,
  dividerComponent,
  animeIgnoreComponent,
  animeComponent,
]
