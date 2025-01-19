'use client'
import { Container } from '@mui/material'
import Toolbox from '@/components/Toolbox'
import Canvas from '../components/canvas/index'
import React, { useEffect, useRef } from 'react'
import styles from './page.module.css'
import { setMouseXY } from '@/store/toolSelection'
import { useAppDispatch, useAppSelector } from '@/utils/TypeScriptHooks'

// note: largest z-index in this file is 50

// todo width of scribble
// width of eraser
// change cursor type based on which tool is selected
// when cursor hovers on navbar, make it normal pointer
export default function Home() {
  const stageRef = useRef<any>()

  const dispatch = useAppDispatch()
  const { mousePosition, strokeWidth, drawingCursor, value } = useAppSelector(
    state => state.toolSelection,
  )
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      const mouseXY = {
        x: e.clientX,
        y: e.clientY,
      }

      dispatch(setMouseXY(mouseXY))
    }

    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])

  return (
    <main id='main-page' style={{ height: '100%', width: '100%' }}>
      <header style={{ backgroundColor: '#F3F4F7', height: '50px' }}>
        <nav></nav>
      </header>
      <div
        id='cursor'
        style={{
          display: `${
            drawingCursor && (value === 'SCRIBBLE' || value === 'ERASER')
              ? 'block'
              : 'none'
          }`,
          top: mousePosition.y - strokeWidth / 2,
          left: mousePosition.x - strokeWidth / 2,
          height: `${strokeWidth}px`,
          width: `${strokeWidth}px`,
          zIndex: 50,
        }}
        className={styles.cursor}
      />
      <Container
        disableGutters
        sx={{
          margin: 0,
          padding: '0px',
          backgroundColor: '#e5e5e5',
          display: 'flex',
          height: 'calc(100% - 50px) ',
          width: '100%',
          justifyContent: 'space-around',
          paddingX: '0px',
        }}
        maxWidth={false}
        id='main-container'
      >
        <Toolbox />
        <Canvas stageRef={stageRef} />
      </Container>
    </main>
  )
}
