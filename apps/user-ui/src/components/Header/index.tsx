import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className='w-full bg-white'>
      <div
        className='w-[80%] m-auto py-5 auto flex items-center justify-between bg-red-500'
      >
        <div>
          <Link href='/' className='text-2xl font-bold text-gray-800'>
            <span className='text-3xl font-[500'>Kepi</span>
          </Link>
        </div>
        <div className='w-[50%] relative'>
          <input type='text'
            placeholder='Search for products...'
            className='w-full px-4 font-Poppins font-medium border-[3px] border-blue-500 outline-none h-[55px]' />
          <div className='w-[60px] cursor-pointer flex items-center justify-center h-[55px] absolute top-0 right-0 '>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
