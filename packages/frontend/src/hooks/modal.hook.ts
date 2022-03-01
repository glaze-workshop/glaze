import { useCallback, useState } from 'react'

export const useModalState = () => {
  const [open, setOpen] = useState(false)
  const handleModelClose = useCallback(() => setOpen(false), [])
  const handleModelOpen = useCallback(() => setOpen(true), [])
  return { isOpen: open, handleModelClose, handleModelOpen }
}
