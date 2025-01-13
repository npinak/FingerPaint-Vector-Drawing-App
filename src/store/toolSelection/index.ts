import { createSlice } from '@reduxjs/toolkit'

export const ACTIONS = {
  SELECT: 'SELECT',
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
  SCRIBBLE: 'SCRIBBLE',
  ARROW: 'ARROW',
  ERASER: 'ERASER',
}

type MousePositonType = {
  x: number
  y: number
}

export interface ToolSelectionState {
  value: 'SELECT' | 'RECTANGLE' | 'CIRCLE' | 'SCRIBBLE' | 'ARROW' | 'ERASER'
  color: string
  strokeWidth: number
  cursorType: string
  cursorWidth: string | null
  mousePosition: MousePositonType
}

const initialState: ToolSelectionState = {
  value: 'SCRIBBLE',
  color: '#fff',
  strokeWidth: 5,
  cursorType: 'scribble',
  cursorWidth: null,
  mousePosition: { x: 0, y: 0 },
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
    setStrokeWidth: (state, action) => {
      state.strokeWidth = action.payload
    },
    setMouseXY: (state, action) => {
      state.mousePosition = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { select, setColor, setStrokeWidth, setMouseXY } =
  ToolSelectionSlice.actions

export default ToolSelectionSlice.reducer
