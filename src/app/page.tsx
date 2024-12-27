'use client'
import { AppBar, Container, Toolbar } from '@mui/material'
import Toolbox from '@/components/Toolbox'
import Canvas from '../components/canvas/index'
import { useRef } from 'react'

export default function Home() {
  const stageRef = useRef<any>()

  return (
    <main id='main-page' style={{ height: '100%', width:'100%' }}>
      <AppBar position='sticky'>
        <Toolbar sx={{ height: '50px' }}></Toolbar>
      </AppBar>
      <Container
      disableGutters
        sx={{
          margin: 0,
          padding: '0px',
          backgroundColor: '#e5e5e5',
          display: 'flex',
          height: '100%',
          width:'100%',
          justifyContent: 'space-around',
          paddingX:'0px'
        }}
        maxWidth={false}
        id='main-container'
      >
        {/* <Toolbox /> */}
        <Canvas stageRef={stageRef} />
      </Container>
    </main>
  )
}
