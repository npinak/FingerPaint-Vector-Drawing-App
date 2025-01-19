'use client'

import {
  Box,
  Button,
  Popover,
  Slider,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { select, setStrokeWidth, setStrokeColor } from '@/store/toolSelection'
import { SliderPicker } from 'react-color'
import { useAppDispatch } from '@/utils/TypeScriptHooks'
import { styled } from '@mui/system'
import {
  Pencil,
  Hand,
  Circle,
  Rectangle,
  ArrowUp,
  Eraser,
  Trash,
} from '@phosphor-icons/react'
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
  const strokeColor = useAppSelector(state => state.toolSelection.strokeColor)
  const strokeWidth = useAppSelector(state => state.toolSelection.strokeWidth)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const [alignment, setAlignment] = React.useState<string | null>('select')

  const buttonDimensionRef = useRef<HTMLButtonElement>(null)

  const handleStrokeWidth = (_event: Event, value: number | Array<number>) => {
    dispatch(setStrokeWidth(value))
  }

  useEffect(() => {
    const dimensions = buttonDimensionRef.current?.getBoundingClientRect()
    setHighlightDivPos(dimensions)
  }, [])

  // const _handleExport =() => {
  // note: implement export
  //   const uri = stageRef.current.toDataURL()
  //   const link = document.createElement('a')
  //   link.href = uri
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // }

  const handleToolSelection = (event: React.MouseEvent<HTMLElement>) => {
    setAlignment(null)
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

  const handleChangeComplete = ({ hex }: { hex: string }) => {
    if (anchorEl?.id === 'stroke-color-button') {
      dispatch(setStrokeColor(hex))
    } else {
      dispatch(setColor(hex))
    }
  }

  const handleAlignment = (
    _event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment)
    dispatch(select(newAlignment === 'select' ? 'SELECT' : 'DELETE'))
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '120px',

        backgroundColor: '#E7E9EE',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: `${
            alignment === 'delete' || alignment === 'select'
              ? '#00000000'
              : 'secondary.main'
          }`,
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
      <Box
        sx={{
          width: '10%',
          minWidth: '75px',
          maxWidth: '75px',
          display: 'flex',

          justifyContent: 'space-between',
        }}
      >
        <button
          style={{
            height: '100%',
            maxHeight: '50px',
            minHeight: '40px',
            width: '45%',
            border: '2px solid #d1d1d1',
            backgroundColor: strokeColor,
          }}
          aria-describedby={id}
          id='stroke-color-button'
          // variant='contained'
          onClick={handleClick}
        />
        <button
          style={{
            height: '100%',
            maxHeight: '50px',
            minHeight: '40px',
            width: '45%',
            border: '2px solid #d1d1d1',
            backgroundColor: selectedColor,
          }}
          id='fill-color-button'
          aria-describedby={id}
          // variant='contained'
          onClick={handleClick}
        />
      </Box>
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
            backgroundColor: '#d1d1d1',
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

      <Box
        sx={{
          height: '10%',
          maxHeight: '50px',
          minHeight: '40px',
          width: '10%',
          minWidth: '75px',
          maxWidth: '75px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Slider
          size='small'
          defaultValue={strokeWidth}
          aria-label='Small'
          valueLabelDisplay='auto'
          onChange={handleStrokeWidth}
        />
      </Box>
      <StyledButton
        ref={buttonDimensionRef}
        onClick={handleToolSelection}
        id='SCRIBBLE'
      >
        <Pencil size={28} color='black' />
      </StyledButton>

      <Box>
        <StyledButton id='ERASER' onClick={handleToolSelection}>
          <Eraser size={28} color='black' />
        </StyledButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label='text alignment'
        >
          <Tooltip title='Select Shapes'>
            <ToggleButton value='select' aria-label='centered'>
              <Hand size={18} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title='Delete Shapes'>
            <ToggleButton value='delete' aria-label='left aligned'>
              <Trash size={18} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Box>
      <StyledButton id='CIRCLE' onClick={handleToolSelection}>
        <Circle size={28} color='black' />
      </StyledButton>
      <StyledButton id='RECTANGLE' onClick={handleToolSelection}>
        <Rectangle size={28} color='black' />
      </StyledButton>
      <StyledButton id='ARROW' onClick={handleToolSelection}>
        <ArrowUp size={28} color='black' />
      </StyledButton>

      {/* <Button>Upload Image</Button> */}
      {/* <Button onClick={handleExport}>Export</Button> */}
    </Box>
  )
}

export default Toolbox
