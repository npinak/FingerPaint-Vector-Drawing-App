'use client'
import { Box, Menu, MenuItem } from '@mui/material'
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
import { useAppSelector, useAppDispatch } from '@/utils/TypeScriptHooks'
import { setDrawingCursor } from '@/store/toolSelection'
import { v4 as uuidv4 } from 'uuid'
import type {
  RectangleType,
  CircleType,
  ScribbleType,
  ArrowType,
  ShapeType,
} from './canvas.types'
import { KonvaEventObject } from 'konva/lib/Node'
import { shapes } from 'konva/lib/Shape'
import { SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'

// have to refactor so that all the shapes are stored in one array



function Canvas({ stageRef }: { stageRef: React.MutableRefObject<any> }) {
  const [rectangles, setRectangles] = useState<RectangleType[]>([])
  const [circles, setCircles] = useState<CircleType[]>([])
  const [scribbles, setScribbles] = useState<ScribbleType[]>([])
  const [arrows, setArrows] = useState<ArrowType[]>([])
  const isPainting = useRef<boolean>(false)
  const transformerRef = useRef<any>() //fix: find proper type
  const stageContainerRef = useRef<HTMLDivElement>()
  const strokeWidth = useAppSelector(state => state.toolSelection.strokeWidth)
  const strokeColor = useAppSelector(state => state.toolSelection.strokeColor)
  const dispatch = useAppDispatch()

  const [shapesArray, setShapesArray] = useState<ShapeType[]>([])

  

  const rightClick = useRef(false)

  const currentShapeID = useRef<string>('')

  const toolSelected = useAppSelector(state => state.toolSelection.value)
  const fillColor = useAppSelector(state => state.toolSelection.color)

  const isDraggable = toolSelected === 'SELECT'

  function onPointerMove() {
    if (toolSelected === 'SELECT' || !isPainting.current || rightClick.current)
      return

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()

    switch (toolSelected) {
      case 'RECTANGLE':
      setShapesArray(shapesArray => {
        return shapesArray.map(shape => {
          if (shape.shapeData.ID === currentShapeID.current){
            return {
              ...shape,
              shapeData:{
                ...shape.shapeData,
                //@ts-ignore -- x will exist for rectangle
                width: x - shape.shapeData.x,
                //@ts-ignore -- y will exist for rectangle
                height: y - shape.shapeData.y
              }
            }
          }
          return shape
        })
      })
      
        break
      case 'CIRCLE':
        setShapesArray(shapesArray => {
          return shapesArray.map(shape => {
            if (shape.shapeData.ID === currentShapeID.current){
              return {
                ...shape,
                shapeData:{
                  ...shape.shapeData,
                  //@ts-ignore -- x will exist for circle
                  width: x - shape.shapeData.x,
                  //@ts-ignore -- y will exist for circle
                  height: y - shape.shapeData.y
                }
              }
            }
            return shape
          })
        })
        break
      case 'SCRIBBLE':
        // setScribbles(scribbles =>
        //   scribbles.map(scribble => {
        //     if (scribble.ID === currentShapeID.current) {
        //       return {
        //         ...scribble,
        //         points: [...scribble.points, x, y],
        //       }
        //     }
        //     return scribble
        //   }),
        // )
        
        break
      case 'ERASER':
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
    if (toolSelected === 'SELECT' || rightClick.current) return

    const stage = stageRef.current
    const { x, y } = stage.getPointerPosition()

    const ID = uuidv4()

    currentShapeID.current = ID
    isPainting.current = true

    switch (toolSelected) {
      case 'RECTANGLE':

      //info: this function adds new Shapes

      setShapesArray(shapesArray => {
        return [
          ...shapesArray,
          {
            shapeType: 'rectangle',
            shapeData: {
              ID,
              x,
              y,
              height: 0,
              width: 0,
              fillColor,
              strokeWidth,
              strokeColor,
            },
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
              strokeWidth,
              strokeColor,
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
            toolSelected,
            strokeWidth,
            strokeColor,
          },
        ])
        break
      case 'ERASER':
        setScribbles(scribbles => [
          ...scribbles,
          {
            ID,
            points: [x, y],
            fillColor,
            toolSelected,
            strokeWidth,
            strokeColor,
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
            strokeWidth,
            strokeColor,
          },
        ])
        break
    }
  }

  function onClick(
    e: KonvaEventObject<MouseEvent>,
    isLine?: boolean,
    shapeInfo?: Record<string, string>,
  ) {
    if (shapeInfo && toolSelected === 'DELETE') {
      deleteShape(shapeInfo)
    }

    if (toolSelected !== 'SELECT' || isLine) return

    const target = e.currentTarget

    transformerRef.current?.nodes([target])
  }

  const deleteShape = (shapeInfo: Record<string, string>) => {
    const { id, shape } = shapeInfo

    switch (shape) {
      case 'circle':
        const filteredCircles = circles.filter(circle => {
          return circle.ID !== id
        })

        setCircles(filteredCircles)
        break
      case 'rectangle':
        const filteredRectangles = rectangles.filter(rectangle => {
          return rectangle.ID !== id
        })

        setRectangles(filteredRectangles)
      case 'arrow':
        const filteredArrows = arrows.filter(arrow => {
          return arrow.ID !== id
        })

        setArrows(filteredArrows)
    }
  }

  return (
    <Box
      id='canvas-div'
      ref={stageContainerRef}
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
        cursor: `${
          toolSelected !== 'SCRIBBLE' || 'ERASER' ? 'crosshair' : 'none'
        }`,
      }}
      onMouseOver={() => {
        dispatch(setDrawingCursor(true))
      }}
      onMouseOut={() => {
        dispatch(setDrawingCursor(false))
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
          {/* {rectangles.map(rectangle => {
            return (
              <Rect
                draggable={isDraggable}
                key={rectangle.ID}
                x={rectangle.x}
                y={rectangle.y}
                stroke={rectangle.strokeColor}
                strokeWidth={rectangle.strokeWidth}
                fill={rectangle.fillColor}
                height={rectangle.height}
                width={rectangle.width}
                onClick={e =>
                  onClick(e, false, { id: rectangle.ID, shape: 'rectangle' })
                }
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
                globalCompositeOperation='source-over'
              />
            )
          })} */}


          {shapesArray.map(shape => {
            if (shape.shapeType === 'rectangle'){
              return (
                <Rect
                draggable={isDraggable}
                key={shape.shapeData.ID}
                //@ts-ignore -- x will exist for rectangle
                x={shape.shapeData.x}
                //@ts-ignore -- y will exist for rectangle
                y={shape.shapeData.y}
                stroke={shape.shapeData.strokeColor}
                strokeWidth={shape.shapeData.strokeWidth}
                fill={shape.shapeData.fillColor}
                //@ts-ignore
                height={shape.shapeData.height}
                //@ts-ignore -- width will exist for rectangle
                width={shape.shapeData.width}
                onClick={e =>
                  onClick(e, false, { id: shape.shapeData.ID, shape: 'rectangle' })
                }
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
                globalCompositeOperation='source-over'
              />
              )
            }
          })}

          {circles.map(circle => {
            return (
              <Circle
                draggable={isDraggable}
                key={circle.ID}
                stroke={circle.strokeColor}
                x={circle.x}
                strokeWidth={circle.strokeWidth}
                y={circle.y}
                radius={circle.radius}
                fill={circle.fillColor}
                onClick={e =>
                  onClick(e, false, { id: circle.ID, shape: 'circle' })
                }
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
                globalCompositeOperation='source-over'
              />
            )
          })}

          {arrows.map(arrow => (
            <Arrow
              draggable={isDraggable}
              key={arrow.ID}
              points={arrow.points}
              stroke={arrow.strokeColor}
              strokeWidth={arrow.strokeWidth}
              fill={arrow.fillColor}
              onClick={e => onClick(e, false, { id: arrow.ID, shape: 'arrow' })}
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
              globalCompositeOperation='source-over'
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
        <Layer>
          {scribbles.map(scribble => (
            <Line
              // note: draggable is disabled until bring to front/back is added.
              // draggable={isDraggable}
              key={scribble.ID}
              lineCap='round'
              lineJoin='round'
              points={scribble.points}
              stroke={scribble.strokeColor}
              strokeWidth={scribble.strokeWidth}
              fill={scribble.fillColor}
              onClick={e => onClick(e, true)}
              // onMouseEnter={() => {
              //   if (stageContainerRef.current && toolSelected === 'SELECT') {
              //     stageContainerRef.current.style.cursor = 'pointer'
              //   }
              // }}
              // onMouseLeave={() => {
              //   if (stageContainerRef.current && toolSelected === 'SELECT') {
              //     stageContainerRef.current.style.cursor = 'default'
              //   }
              // }}
              globalCompositeOperation={
                scribble.toolSelected === 'ERASER'
                  ? 'destination-out'
                  : 'source-over'
              }
            />
          ))}
          {/* <Transformer ref={transformerRef} /> */}
        </Layer>
      </Stage>
    </Box>
  )
}

export default Canvas
