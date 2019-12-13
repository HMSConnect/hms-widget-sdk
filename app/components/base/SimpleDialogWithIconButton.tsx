import React from 'react'

import { IconButton } from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SimpleDialog, { ISimpleDialogItem } from './SimpleDialog'

const SimpleDialogWithIconButton: React.FunctionComponent<{
  id?: string
  onDialogClose?: any
  buttonText?: string
  dialogTitle?: string
  iconComponent?: any
  list: ISimpleDialogItem[]
}> = ({
  id,
  onDialogClose,
  list,
  dialogTitle,
  iconComponent = <AddCircleOutlineIcon />
}) => {
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (item: ISimpleDialogItem) => {
    setOpen(false)
    if (onDialogClose) {
      onDialogClose(item)
    }
  }

  return (
    <>
      <IconButton
        color='primary'
        aria-label='dialog icon'
        onClick={handleClickOpen}
      >
        {iconComponent}
      </IconButton>
      <SimpleDialog
        id={id}
        open={open}
        dialogTitle={dialogTitle}
        onDialogClose={handleClose}
        list={list}
      />
    </>
  )
}

export default SimpleDialogWithIconButton
