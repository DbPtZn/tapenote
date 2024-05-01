import { Query, QueryState, Commander, Formatter, Injector } from '@textbus/core'

export function colorToolCreator(injector: Injector, formatter: Formatter<any>) {
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  // let viewer!: UISegmentDropdown
  return {
    // viewController: {
    //   elementRef: palette.elementRef,
    //   onComplete: palette.onComplete,
    //   onCancel: new Observable<void>(),
    //   reset() {
    //     palette.update()
    //   },
    //   update(newValue: any) {
    //     // palette.update(newValue)
    //   }
    // },
    // onInit(ui: UISegmentDropdown) {
    //   viewer = ui
    // },
    useValue(value: any) {
      // viewer.leftButton.style.color = value
      commander.applyFormat(formatter, value)
    },
    queryState(): QueryState<any> {
      return query.queryFormat(formatter)
    }
  }
}
