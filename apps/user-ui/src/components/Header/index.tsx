import React from 'react';
import Link from 'next/link';
import HeaderBottom from './header-bottom';

const Header = () => {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
      {/* Top Bar */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center text-sm'>
            <p className='hidden md:block'>
              ✨ Free shipping on orders over $50 | Use code:{' '}
              <span className='font-semibold'>Tesla</span>
            </p>
            <div className='flex items-center gap-4 ml-auto'>
              <Link href='/help' className='hover:underline'>
                Help
              </Link>
              <span>|</span>
              <Link href='/track' className='hover:underline'>
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Bar */}
      <HeaderBottom />
    </header>
  );
};

export default Header;
