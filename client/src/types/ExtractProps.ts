import { ExtractPropTypes, VNodeProps } from 'vue'
type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}
// export type ExtractDefinePropTypes<T> = Writable<Omit<ExtractPropTypes<T['$props']>, keyof VNodeProps | 'class' | 'style'>>
// export type ExtractDefinePropTypes<T> = Writable<Omit<ExtractPropTypes<InstanceType<typeof T>['$props']>, keyof VNodeProps | 'class' | 'style'>>
export type ExtractDefinePropTypes<T extends abstract new (...args: any) => any> = Writable<
  Omit<ExtractPropTypes<InstanceType<T>['$props']>, keyof VNodeProps | 'class' | 'style'>
>
