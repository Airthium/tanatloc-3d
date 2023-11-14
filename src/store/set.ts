import { Store } from '@store'

export const setProps = (set: any) => (props: Store['props']) => {
  set({ props })
}

export const setMainView = (set: any) => (mainView: Store['mainView']) => {
  set({ mainView })
}
