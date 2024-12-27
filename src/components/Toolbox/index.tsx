'use client'

import { Box, Button } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { select } from '@/store/toolSelection'
import { useAppDispatch } from '@/utils/TypeScriptHooks'
import { styled } from '@mui/system'
import { Pencil, Hand, Circle, Rectangle, ArrowUp } from '@phosphor-icons/react'
// import { MuiColorInput } from 'mui-color-input' // todo use for color

const StyledButton = styled(Button)({
  height: '10%',
  maxHeight: '50px',
  minHeight: '40px',
  width: '10%',
  minWidth: '75px',
  maxWidth: '75px',
})

function Toolbox() {
  const dispatch = useAppDispatch()
  const [highlightDivPos, setHighlightDivPos] = useState<DOMRect | undefined>()
  const buttonDimensionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dimensions = buttonDimensionRef.current?.getBoundingClientRect()
    setHighlightDivPos(dimensions)
  }, [])

  // const _handleExport =() => {
  //   const uri = stageRef.current.toDataURL()
  //   const link = document.createElement('a')
  //   link.href = uri
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  const handleToolSelection = (event: React.MouseEvent<HTMLElement>) => {
    // todo update Ref

    const newDimensions = event.currentTarget.getBoundingClientRect()
    setHighlightDivPos(newDimensions)

    dispatch(select(event.currentTarget.id))
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '8%',
        maxWidth: '100px',
        backgroundColor: '#f4f1de',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'secondary.main',
          width: `${highlightDivPos?.width}px`,
          height: `${highlightDivPos?.height}px`,
          position: 'absolute',
          top: `${highlightDivPos?.top}px`,
          left: `${highlightDivPos?.left}px`,
          borderRadius: '5px',
          transition:
            'top 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
        id='toolbar-button-highlight'
      ></Box>
      <StyledButton
        ref={buttonDimensionRef}
        onClick={handleToolSelection}
        id='SELECT'
      >
        <Hand size={28} color='black' />
      </StyledButton>
      <StyledButton onClick={handleToolSelection} id='SCRIBBLE'>
        <Pencil size={28} color='black' />
      </StyledButton>
      <StyledButton id='CIRCLE' onClick={handleToolSelection}>
        <Circle size={28} color='black' />
      </StyledButton>
      <StyledButton id='RECTANGLE' onClick={handleToolSelection}>
        <Rectangle size={28} color='black' />
      </StyledButton>
      <StyledButton id='ARROW' onClick={handleToolSelection}>
        <ArrowUp size={28} color='black' />
      </StyledButton>
      {/* <Button id='ERASER' onClick={handleToolSelection}>
        Eraser
      </Button> */}
      {/* <Button>Fill-Color</Button> */}
      {/* <Button>Upload Image</Button> */}
      {/* <Button onClick={handleExport}>Export</Button> */}
    </Box>
  )
}

export default Toolbox
