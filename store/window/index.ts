interface IState {
  width: number | null
  medium: number
  large: number
}

export const state = () =>
  ({
    width: null, // default
    medium: 640, // medium break in main.scss
    large: 1088, // large break in main.scss
  } as IState)

export const mutations = {
  setWidth: (state: IState, width: number) => {
    state.width = width
  },
}

export const actions = {
  resized({ commit }: { commit: any }, width: number) {
    commit('setWidth', width)
  },
}

export const getters = {
  isDesktop: (state: IState) => {
    if (state.width === null) return null
    return state.width >= state.large
  },
  isTablet: (state: IState) => {
    if (state.width === null) return null
    return state.width < state.large && state.width > state.medium
  },
  isMobile: (state: IState) => {
    if (state.width === null) return null
    return state.width <= state.medium
  },
}
