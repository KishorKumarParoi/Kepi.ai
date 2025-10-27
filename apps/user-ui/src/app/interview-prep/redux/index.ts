import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    filter: 'all',
    theme: 'light',
    isModalOpen: false,
  },
  reducers: {
    setFilter: (state, action) => { state.filter = action.payload },
    toggleTheme: (state) => { state.theme = state.theme === 'light' ? 'dark' : 'light' },
    toggleModal: (state) => { state.isModalOpen = !state.isModalOpen },
  }
})

export const { setFilter, toggleTheme, toggleModal } = uiSlice.actions;

export default uiSlice.reducer;
