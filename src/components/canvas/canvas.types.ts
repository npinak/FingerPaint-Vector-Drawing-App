export type RectangleType = {
  ID: string
  x: number
  y: number
  height: number
  width: number
  fillColor: string
  strokeWidth: number
  strokeColor: string
}

export type ArrowType = {
  ID: string
  points: number[]
  fillColor: string
  strokeWidth: number
  strokeColor: string
}

export type CircleType = {
  ID: string
  x: number
  y: number
  strokeWidth: number
  height: number
  width: number
  fillColor: string
  radius: number
  strokeColor: string
}

export type ScribbleType = {
  ID: string
  points: number[]
  fillColor: string
  toolSelected: string
  strokeWidth: number
  strokeColor: string
}
