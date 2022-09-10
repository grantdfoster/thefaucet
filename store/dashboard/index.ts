interface IState {
  isOpen: boolean
}

export const state = () =>
  ({
    isOpen: false, // default
  } as IState)

export const mutations = {
  setOpen: (state: IState, _payload: boolean) => {
    state.isOpen = _payload
  },
}

export const actions = {
  setOpen({ commit }: { commit: any }, _payload: boolean) {
    console.log('set open: ', _payload)
    commit('setOpen', _payload)
  },
}

export const getters = {
  isOpen: (state: IState) => {
    return state.isOpen
  },
}
