'use client'
import { Container } from '@mui/material'
import Toolbox from '@/components/Toolbox'
import Canvas from '../components/canvas/index'
import { useRef } from 'react'

export default function Home() {
  const stageRef = useRef<any>()

  return (
    <main id='main-page' style={{ height: '100%', width: '100%' }}>
      <header style={{ backgroundColor: 'red', height: '50px' }}>
        <nav></nav>
      </header>
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
