import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '.'

const page = () => {
  const dispatch = useDispatch()
  const filter = useSelector((state: any) => state.ui.filter)
  const theme = useSelector((state: any) => state.ui.theme)
  const isModalOpen = useSelector((state: any) => state.ui.isModalOpen)

  return (
    <div className={theme}>
      <button onClick={() => dispatch(toggleTheme())} >Toggle Theme</button >
      <div>Current Filter: {filter}</div >
      <div>Modal is {isModalOpen ? 'Open' : 'Closed'}</div >
    </div >
  )
}

export default page
