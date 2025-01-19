import { createSlice } from '@reduxjs/toolkit'

export interface AppInfoState {
  backgroundColor: string
}

const initialState: AppInfoState = {
  backgroundColor: '#FFFFFF',
}

export const AppInfoSlice = createSlice({
  name: 'appInfo',
  initialState,
  reducers: {
    setBackgroundColor: (state, action) => {
      state.backgroundColor = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setBackgroundColor } = AppInfoSlice.actions

export default AppInfoSlice.reducer
