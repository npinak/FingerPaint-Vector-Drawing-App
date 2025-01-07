export type RectangleType = {
  ID: string
  x: number
  y: number
  height: number
  width: number
  fillColor: string
}

export type ArrowType = {
  ID: string
  points: number[]
  fillColor: string
}

export type CircleType = {
  ID: string
  x: number
  y: number
  height: number
  width: number
  fillColor: string
  radius: number
}

export type ScribbleType = {
  ID: string
  points: number[]
  fillColor: string
  toolSelected: string
  strokeWidth: number
}
