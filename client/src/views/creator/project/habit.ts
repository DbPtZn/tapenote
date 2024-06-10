import { reactive } from "vue"

type PlatformWidth = '880px' | '1080px' |'100%'
interface PlatformState {
  isScrollbarShow: boolean
  isOutlineShow: boolean
  width: PlatformWidth
}
interface SubtitleState {
  show: boolean
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
        isScrollbarShow: true,
        isOutlineShow: false,
        width: '880px'
      },
      subtitle: {
        show: false
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