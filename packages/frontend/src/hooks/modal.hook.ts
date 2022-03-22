import { useCallback, useState } from 'react'

export const useModalState = () => {
  const [open, setOpen] = useState(false)
  const handleModalClose = useCallback(() => setOpen(false), [])
  const handleModalOpen = useCallback(() => setOpen(true), [])
  return { isOpen: open, handleModalClose, handleModalOpen }
}
