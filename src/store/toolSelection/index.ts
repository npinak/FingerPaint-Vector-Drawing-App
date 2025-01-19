import { createSlice } from '@reduxjs/toolkit'

export const ACTIONS = {
  SELECT: 'SELECT',
  RECTANGLE: 'RECTANGLE',
  CIRCLE: 'CIRCLE',
  SCRIBBLE: 'SCRIBBLE',
  ARROW: 'ARROW',
  ERASER: 'ERASER',
  DELETE: 'DELETE',
}

type MousePositonType = {
  x: number
  y: number
}

export interface ToolSelectionState {
  value:
    | 'SELECT'
    | 'RECTANGLE'
    | 'CIRCLE'
    | 'SCRIBBLE'
    | 'ARROW'
    | 'ERASER'
    | 'DELETE'
  color: string
  strokeWidth: number
  cursorType: string
  cursorWidth: string | null
  mousePosition: MousePositonType
  strokeColor: string
  drawingCursor: boolean
}

const initialState: ToolSelectionState = {
  value: 'SCRIBBLE',
  color: '#fff',
  strokeWidth: 5,
  cursorType: 'scribble',
  cursorWidth: null,
  mousePosition: { x: 0, y: 0 },
  strokeColor: '#000000',
  drawingCursor: true,
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
    setStrokeColor: (state, action) => {
      state.strokeColor = action.payload
    },
    setDrawingCursor: (state, action) => {
      state.drawingCursor = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  select,
  setColor,
  setStrokeWidth,
  setMouseXY,
  setStrokeColor,
  setDrawingCursor,
} = ToolSelectionSlice.actions

export default ToolSelectionSlice.reducer
