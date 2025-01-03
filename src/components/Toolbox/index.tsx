'use client'

import { Box, Button, Popover } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { select } from '@/store/toolSelection'
import { SliderPicker } from 'react-color'
import { useAppDispatch } from '@/utils/TypeScriptHooks'
import { styled } from '@mui/system'
import { Pencil, Hand, Circle, Rectangle, ArrowUp } from '@phosphor-icons/react'
import { useAppSelector } from '@/utils/TypeScriptHooks'

import { setColor } from '@/store/toolSelection'
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
  const selectedColor = useAppSelector(state => state.toolSelection.color)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleChangeComplete = ({ hex }: { hex: string }) => {
    dispatch(setColor(hex))
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
      />
      <div>
        <Button
          sx={{
            height: '10%',
            maxHeight: '50px',
            minHeight: '40px',
            width: '10%',
            minWidth: '75px',
            maxWidth: '75px',
            border: '3px solid #d1d1d1',
            backgroundColor: selectedColor,
          }}
          aria-describedby={id}
          variant='contained'
          onClick={handleClick}
        ></Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          sx={{ marginLeft: '10px' }}
        >
          <Box
            sx={{
              width: '300px',
              // height: '100px',
              backgroundColor: '#d1d1d1',
              // display: 'flex',
              justifyContent: 'center',
              padding: '15px',
            }}
          >
            <SliderPicker
              color={selectedColor}
              onChangeComplete={handleChangeComplete}
            />
          </Box>
        </Popover>
      </div>

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
