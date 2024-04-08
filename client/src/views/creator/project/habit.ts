import { reactive } from "vue"

type PlatformWidth = '880px' | '1080px' |'100%'
interface PlatformState {
  // isScrollbarHide: boolean
  // isOutlineHide: boolean
  width: PlatformWidth
}
interface SubtitleState {
  isShow: boolean
}
interface HabitState {
  platform: PlatformState
  subtitle: SubtitleState
}

export class Habit {
  state: HabitState
  platformWidthOptions: ({ label: string; value: PlatformWidth })[]
  constructor() {
    this.state = reactive({
      platform: {
        // isScrollbarHide: false,
        // isOutlineHide: false,
        width: '880px'
      },
      subtitle: {
        isShow: false
      }
    })
    this.platformWidthOptions = [
      {
        label: '窄屏',
        value: '880px'
      },
      {
        label: '宽屏',
        value: '1080px'
      },
      {
        label: '超宽',
        value: '100%'
      }
    ]
  }

}