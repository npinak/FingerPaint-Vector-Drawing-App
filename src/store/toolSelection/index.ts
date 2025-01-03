import { createSlice } from '@reduxjs/toolkit'

export const ACTIONS = {
  SELECT: 'SELECT',
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
  SCRIBBLE: 'SCRIBBLE',
  ARROW: 'ARROW',
  ERASER: 'ERASER',
}

export interface ToolSelectionState {
  value: 'SELECT' | 'RECTANGLE' | 'CIRCLE' | 'SCRIBBLE' | 'ARROW' | 'ERASER'
  color: string
}

const initialState: ToolSelectionState = {
  value: 'RECTANGLE',
  color: '#fff',
}

export const ToolSelectionSlice = createSlice({
  name: 'toolSelection',
  initialState,
  reducers: {
    select: (state, action) => {
      state.value = action.payload
    },
    setColor: (state, action) => {
      state.color = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { select, setColor } = ToolSelectionSlice.actions

export default ToolSelectionSlice.reducer
