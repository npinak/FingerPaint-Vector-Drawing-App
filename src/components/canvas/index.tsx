'use client'
import { Box } from '@mui/material'
import React, { useRef, useState } from 'react'
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Arrow,
  Transformer,
} from 'react-konva'
import { useAppSelector } from '@/utils/TypeScriptHooks'
import { v4 as uuidv4 } from 'uuid'
import type {
  RectangleType,
  CircleType,
  ScribbleType,
  ArrowType,
} from './canvas.types'
import { KonvaEventObject } from 'konva/lib/Node'

function Canvas({ stageRef }: { stageRef: React.MutableRefObject<any> }) {
  const [rectangles, setRectangles] = useState<RectangleType[]>([])
  const [circles, setCircles] = useState<CircleType[]>([])
  const [scribbles, setScribbles] = useState<ScribbleType[]>([])
  const [arrows, setArrows] = useState<ArrowType[]>([])
  const isPainting = useRef<boolean>(false)
  const transformerRef = useRef<any>() //fix: find proper type
  const stageContainerRef = useRef<HTMLDivElement>()

  const currentShapeID = useRef<string>('')
  const strokeColor = '#000'
  const toolSelected = useAppSelector(state => state.toolSelection.value)
  const fillColor = useAppSelector(state => state.toolSelection.color)

  const isDraggable = toolSelected === 'SELECT'

  //

  function onPointerMove() {
    if (toolSelected === 'SELECT' || !isPainting.current) return

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()

    switch (toolSelected) {
      case 'RECTANGLE':
        setRectangles(rectangles => {
          return rectangles.map(rectangle => {
            if (rectangle.ID === currentShapeID.current) {
              return {
                ...rectangle,
                width: x - rectangle.x,
                height: y - rectangle.y,
              }
            }
            return rectangle
          })
        })
        break
      case 'CIRCLE':
        setCircles(circles => {
          return circles.map(circle => {
            if (circle.ID === currentShapeID.current) {
              return {
                ...circle,

                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              }
            }
            return circle
          })
        })
        break
      case 'SCRIBBLE':
        setScribbles(scribbles =>
          scribbles.map(scribble => {
            if (scribble.ID === currentShapeID.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              }
            }
            return scribble
          }),
        )
        break
      case 'ARROW':
        setArrows(arrows =>
          arrows.map(arrow => {
            if (arrow.ID === currentShapeID.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              }
            }
            return arrow
          }),
        )
        break
    }
  }

  function onPointerUp() {
    isPainting.current = false
  }

  function onPointerDown() {
    if (toolSelected === 'SELECT') return

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()

    const ID = uuidv4()

    currentShapeID.current = ID
    isPainting.current = true

    switch (toolSelected) {
      case 'RECTANGLE':
        setRectangles(rectangles => {
          return [
            ...rectangles,
            {
              ID,
              x,
              y,
              height: 0,
              width: 0,
              fillColor,
            },
          ]
        })
        break
      case 'CIRCLE':
        setCircles(circles => {
          return [
            ...circles,
            {
              ID,
              x,
              y,
              height: 0,
              width: 0,
              radius: 0,
              fillColor,
            },
          ]
        })
        break
      case 'SCRIBBLE':
        setScribbles(scribbles => [
          ...scribbles,
          {
            ID,
            points: [x, y],
            fillColor,
          },
        ])
        break
      case 'ARROW':
        setArrows(arrows => [
          ...arrows,
          {
            ID,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ])
        break
    }
  }

  function onClick(e: KonvaEventObject<MouseEvent>) {
    if (toolSelected !== 'SELECT') return
    const target = e.currentTarget

    transformerRef.current?.nodes([target])
  }

  return (
    <Box
      id='canvas-div'
      ref={stageContainerRef}
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      <Stage
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={stageRef}
        height={stageContainerRef.current?.offsetHeight}
        width={stageContainerRef.current?.offsetWidth}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            height={stageContainerRef.current?.offsetHeight}
            width={stageContainerRef.current?.offsetWidth}
            fill='#ffffff'
            id='bg'
          />
          {rectangles.map(rectangle => {
            return (
              <Rect
                draggable={isDraggable}
                key={rectangle.ID}
                x={rectangle.x}
                y={rectangle.y}
                stroke={strokeColor}
                strokeWidth={2}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                onClick={onClick}
                onMouseEnter={() => {
                  if (stageContainerRef.current && toolSelected === 'SELECT') {
                    stageContainerRef.current.style.cursor = 'pointer'
                  }
                }}
                onMouseLeave={() => {
                  if (stageContainerRef.current && toolSelected === 'SELECT') {
                    stageContainerRef.current.style.cursor = 'default'
                  }
                }}
              />
            )
          })}

          {circles.map(circle => {
            return (
              <Circle
                draggable={isDraggable}
                key={circle.ID}
                stroke={strokeColor}
                strokeWidth={2}
                x={circle.x}
                y={circle.y}
                radius={circle.radius}
                fill={circle.fillColor}
                onClick={onClick}
                onMouseEnter={() => {
                  if (stageContainerRef.current && toolSelected === 'SELECT') {
                    stageContainerRef.current.style.cursor = 'pointer'
                  }
                }}
                onMouseLeave={() => {
                  if (stageContainerRef.current && toolSelected === 'SELECT') {
                    stageContainerRef.current.style.cursor = 'default'
                  }
                }}
              />
            )
          })}

          {scribbles.map(scribble => (
            <Line
              draggable={isDraggable}
              key={scribble.ID}
              lineCap='round'
              lineJoin='round'
              points={scribble.points}
              stroke={strokeColor}
              strokeWidth={2}
              fill={scribble.fillColor}
              onClick={onClick}
              onMouseEnter={() => {
                if (stageContainerRef.current && toolSelected === 'SELECT') {
                  stageContainerRef.current.style.cursor = 'pointer'
                }
              }}
              onMouseLeave={() => {
                if (stageContainerRef.current && toolSelected === 'SELECT') {
                  stageContainerRef.current.style.cursor = 'default'
                }
              }}
            />
          ))}
          {arrows.map(arrow => (
            <Arrow
              draggable={isDraggable}
              key={arrow.ID}
              points={arrow.points}
              stroke={strokeColor}
              strokeWidth={2}
              fill={arrow.fillColor}
              onClick={onClick}
              onMouseEnter={() => {
                if (stageContainerRef.current && toolSelected === 'SELECT') {
                  stageContainerRef.current.style.cursor = 'pointer'
                }
              }}
              onMouseLeave={() => {
                if (stageContainerRef.current && toolSelected === 'SELECT') {
                  stageContainerRef.current.style.cursor = 'default'
                }
              }}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </Box>
  )
}

export default Canvas
