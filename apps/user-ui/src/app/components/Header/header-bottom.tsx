'use client';

import { AlignLeft, ChevronDown, ChevronRight, X, Menu } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingCart, Heart } from 'lucide-react';
import {
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
  Book,
  Baby,
  Utensils,
  Palette,
} from 'lucide-react';

interface SubCategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  icon: React.ReactNode;
  subcategories?: SubCategory[];
}

const categories: Category[] = [
  {
    name: 'Electronics',
    href: '/category/electronics',
    icon: <Smartphone className='w-5 h-5' />,
    subcategories: [
      { name: 'Mobile Phones', href: '/category/electronics/phones' },
      { name: 'Laptops & Computers', href: '/category/electronics/laptops' },
      { name: 'Tablets', href: '/category/electronics/tablets' },
      { name: 'Smart Watches', href: '/category/electronics/watches' },
      { name: 'Cameras', href: '/category/electronics/cameras' },
      { name: 'Audio & Headphones', href: '/category/electronics/audio' },
    ],
  },
  {
    name: 'Fashion',
    href: '/category/fashion',
    icon: <Shirt className='w-5 h-5' />,
    subcategories: [
      { name: "Men's Clothing", href: '/category/fashion/mens' },
      { name: "Women's Clothing", href: '/category/fashion/womens' },
      { name: 'Kids Fashion', href: '/category/fashion/kids' },
      { name: 'Shoes', href: '/category/fashion/shoes' },
      { name: 'Accessories', href: '/category/fashion/accessories' },
      { name: 'Jewelry', href: '/category/fashion/jewelry' },
    ],
  },
  {
    name: 'Home & Living',
    href: '/category/home',
    icon: <Home className='w-5 h-5' />,
    subcategories: [
      { name: 'Furniture', href: '/category/home/furniture' },
      { name: 'Home Decor', href: '/category/home/decor' },
      { name: 'Kitchen & Dining', href: '/category/home/kitchen' },
      { name: 'Bedding', href: '/category/home/bedding' },
      { name: 'Lighting', href: '/category/home/lighting' },
    ],
  },
  {
    name: 'Beauty & Health',
    href: '/category/beauty',
    icon: <Palette className='w-5 h-5' />,
    subcategories: [
      { name: 'Skincare', href: '/category/beauty/skincare' },
      { name: 'Makeup', href: '/category/beauty/makeup' },
      { name: 'Haircare', href: '/category/beauty/haircare' },
      { name: 'Fragrances', href: '/category/beauty/fragrances' },
      { name: 'Health Supplements', href: '/category/beauty/supplements' },
    ],
  },
  {
    name: 'Sports & Fitness',
    href: '/category/sports',
    icon: <Dumbbell className='w-5 h-5' />,
    subcategories: [
      { name: 'Gym Equipment', href: '/category/sports/gym' },
      { name: 'Sports Wear', href: '/category/sports/wear' },
      { name: 'Outdoor Sports', href: '/category/sports/outdoor' },
      { name: 'Yoga & Fitness', href: '/category/sports/yoga' },
    ],
  },
  {
    name: 'Books & Stationery',
    href: '/category/books',
    icon: <Book className='w-5 h-5' />,
    subcategories: [
      { name: 'Fiction', href: '/category/books/fiction' },
      { name: 'Non-Fiction', href: '/category/books/non-fiction' },
      { name: 'Educational', href: '/category/books/educational' },
      { name: 'Stationery', href: '/category/books/stationery' },
    ],
  },
  {
    name: 'Baby & Kids',
    href: '/category/baby',
    icon: <Baby className='w-5 h-5' />,
    subcategories: [
      { name: 'Baby Care', href: '/category/baby/care' },
      { name: 'Toys', href: '/category/baby/toys' },
      { name: 'Baby Fashion', href: '/category/baby/fashion' },
      { name: 'Feeding', href: '/category/baby/feeding' },
    ],
  },
  {
    name: 'Groceries',
    href: '/category/groceries',
    icon: <Utensils className='w-5 h-5' />,
    subcategories: [
      { name: 'Fresh Produce', href: '/category/groceries/fresh' },
      { name: 'Beverages', href: '/category/groceries/beverages' },
      { name: 'Snacks', href: '/category/groceries/snacks' },
      { name: 'Dairy Products', href: '/category/groceries/dairy' },
    ],
  },
];

const navLinks = [
  { name: '🔥 Hot Deals', href: '/deals' },
  { name: '✨ New Arrivals', href: '/new-arrivals' },
  { name: '💡 Trending Now', href: '/trending' },
  { name: '⭐ Best Sellers', href: '/bestsellers' },
  { name: '🏷️ Clearance Sale', href: '/clearance' },
  { name: '🎁 Gift Cards', href: '/gift-cards' },
];

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showMainHeader, setShowMainHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track scroll position and hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we should show the main header
      if (currentScrollY > 150) {
        // If scrolling down, hide main header
        if (currentScrollY > lastScrollY) {
          setShowMainHeader(false);
          setIsSticky(true);
        } else {
          // If scrolling up, show main header
          setShowMainHeader(true);
          setIsSticky(true);
        }
      } else {
        // At the top of the page, always show
        setShowMainHeader(true);
        setIsSticky(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false);
        setHoveredCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Main Header - Hides on scroll down */}
      <div
        className={`border-b border-gray-100 transition-transform duration-300 ${showMainHeader ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-20'>
            {/* Logo */}
            <div className='flex-shrink-0'>
              <Link href='/' className='flex items-center space-x-3 group'>
                <div className='relative'>
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
                    <span className='text-white font-bold text-2xl'>K</span>
                  </div>
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></div>
                </div>
                <div className='hidden sm:block'>
                  <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    Kepi.ai
                  </h1>
                  <p className='text-xs text-gray-500 -mt-1'>Smart Shopping</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className='hidden lg:flex flex-1 max-w-2xl mx-8'>
              <form className='relative w-full group' action='/search' method='get'>
                <input
                  type='text'
                  name='q'
                  placeholder='Search for products, brands, and more...'
                  className='w-full pl-12 pr-4 py-3.5 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium placeholder:text-gray-400'
                />
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
              </form>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-2 sm:gap-4'>
              {/* Wishlist */}
              <Link
                href='/wishlist'
                className='relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
              >
                <Heart className='w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors' />
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg'>
                  3
                </span>
              </Link>

              {/* Cart */}
              <Link
                href='/cart'
                className='relative p-2 sm:p-2.5 hover:bg-gray-100 rounded-full transition-colors group'
              >
                <ShoppingCart className='w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors' />
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg'>
                  5
                </span>
              </Link>

              {/* Login Button */}
              <Link
                href='/login'
                className='hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-xl hover:scale-105 transition-all duration-300'
              >
                <User className='w-5 h-5' />
                <div className='text-left'>
                  <p className='text-xs opacity-90'>Hello,</p>
                  <p className='text-sm font-semibold -mt-0.5'>Sign In</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation - Becomes sticky when main header hides */}
      <div
        className={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100] bg-white shadow-lg' : 'relative'
          }`}
      >
        <div className='w-full px-4 sm:w-[90%] lg:w-[80%] relative m-auto flex items-center justify-between py-2 sm:py-3'>
          {/* Logo - Shows when sticky */}
          {isSticky && (
            <Link href='/' className='hidden md:flex items-center space-x-2 mr-4 group animate-slideRight'>
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105'>
                  <span className='text-white font-bold text-xl'>K</span>
                </div>
                <div className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white'></div>
              </div>
              <div className='hidden lg:block'>
                <h1 className='text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Kepi.ai
                </h1>
              </div>
            </Link>
          )}

          {/* Category Dropdown Container - Desktop & Tablet */}
          <div className='hidden md:block relative' ref={dropdownRef}>
            {/* Dropdown Trigger */}
            <div
              className={`w-[200px] lg:w-[260px] cursor-pointer flex items-center justify-between px-4 lg:px-5 h-[45px] lg:h-[50px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md ${show ? 'rounded-t-lg' : 'rounded-lg'
                }`}
              onClick={() => {
                setShow(!show);
                setHoveredCategory(null);
              }}
            >
              <div className='flex items-center gap-2 lg:gap-3'>
                <AlignLeft color='white' size={18} />
                <span className='text-white font-semibold text-xs lg:text-sm'>All Categories</span>
              </div>
              <ChevronDown
                className={`text-white transition-transform duration-300 ${show ? 'rotate-180' : 'rotate-0'
                  }`}
                size={18}
              />
            </div>

            {/* Desktop Dropdown Menu */}
            {show && (
              <div className='absolute top-[45px] lg:top-[50px] left-0 w-[200px] lg:w-[260px] bg-white shadow-2xl rounded-b-lg border-t-2 border-blue-600 overflow-hidden z-50 animate-slideDown'>
                <div className='max-h-[400px] lg:max-h-[500px] overflow-y-auto custom-scrollbar'>
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className='relative'
                      onMouseEnter={() => setHoveredCategory(index)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <Link
                        href={category.href}
                        className={`flex items-center justify-between px-4 lg:px-5 py-2.5 lg:py-3.5 hover:bg-blue-50 transition-all duration-200 border-b border-gray-100 group ${hoveredCategory === index ? 'bg-blue-50' : ''
                          }`}
                      >
                        <div className='flex items-center gap-2 lg:gap-3'>
                          <div className='text-blue-600 group-hover:scale-110 transition-transform duration-200'>
                            {category.icon}
                          </div>
                          <span className='text-xs lg:text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors'>
                            {category.name}
                          </span>
                        </div>
                        {category.subcategories && (
                          <ChevronRight
                            size={14}
                            className='text-gray-400 group-hover:text-blue-600 transition-colors'
                          />
                        )}
                      </Link>

                      {/* Subcategories Mega Menu */}
                      {category.subcategories && hoveredCategory === index && (
                        <div className='absolute left-full top-0 ml-1 w-[240px] lg:w-[280px] bg-white shadow-2xl rounded-lg border border-gray-200 z-[60] animate-slideRight'>
                          <div className='p-3 lg:p-4'>
                            <h3 className='text-xs lg:text-sm font-bold text-gray-800 mb-2 lg:mb-3 pb-2 border-b-2 border-blue-600'>
                              {category.name}
                            </h3>
                            <div className='space-y-1'>
                              {category.subcategories.map((sub, subIndex) => (
                                <Link
                                  key={subIndex}
                                  href={sub.href}
                                  className='block px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200'
                                >
                                  <span className='hover:translate-x-1 inline-block transition-transform duration-200'>
                                    {sub.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                            <Link
                              href={category.href}
                              className='block mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-200 text-xs lg:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors'
                            >
                              View All {category.name} →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* View All Categories Link */}
                <Link
                  href='/categories'
                  className='block px-4 lg:px-5 py-3 lg:py-4 bg-gradient-to-r from-blue-50 to-purple-50 text-center text-xs lg:text-sm font-semibold text-blue-600 hover:text-blue-700 border-t-2 border-blue-100 transition-colors'
                >
                  View All Categories →
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
            onClick={() => setShowMobileNav(!showMobileNav)}
          >
            {showMobileNav ? (
              <X className='w-6 h-6 text-gray-700' />
            ) : (
              <Menu className='w-6 h-6 text-gray-700' />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center gap-4 xl:gap-8 overflow-x-auto flex-1 ml-4'>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='px-3 py-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 whitespace-nowrap'
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Scrollable */}
          <nav className='hidden md:flex lg:hidden items-center gap-4 overflow-x-auto flex-1 ml-4'>
            {navLinks.slice(0, 4).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className='px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600 hover:bg-white rounded-lg transition-all duration-200 whitespace-nowrap'
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileNav && (
          <div className='md:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown'>
            {/* Mobile Categories */}
            <div className='max-h-[60vh] overflow-y-auto custom-scrollbar'>
              <div className='px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700'>
                <h3 className='text-white font-semibold text-sm flex items-center gap-2'>
                  <AlignLeft size={18} />
                  Categories
                </h3>
              </div>

              {categories.map((category, index) => (
                <div key={index} className='border-b border-gray-100'>
                  <div
                    className='flex items-center justify-between px-4 py-3 active:bg-gray-50'
                    onClick={() =>
                      setExpandedCategory(expandedCategory === index ? null : index)
                    }
                  >
                    <div className='flex items-center gap-3'>
                      <div className='text-blue-600'>{category.icon}</div>
                      <Link
                        href={category.href}
                        className='text-sm font-medium text-gray-700'
                        onClick={(e) => e.stopPropagation()}
                      >
                        {category.name}
                      </Link>
                    </div>
                    {category.subcategories && (
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-200 ${expandedCategory === index ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </div>

                  {/* Mobile Subcategories */}
                  {category.subcategories && expandedCategory === index && (
                    <div className='bg-gray-50 px-4 py-2 space-y-1 animate-slideDown'>
                      {category.subcategories.map((sub, subIndex) => (
                        <Link
                          key={subIndex}
                          href={sub.href}
                          className='block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition-colors'
                          onClick={() => setShowMobileNav(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Quick Links */}
            <div className='px-4 py-3 bg-gray-50 border-t-2 border-gray-200'>
              <div className='grid grid-cols-2 gap-2'>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className='px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition-all duration-200 text-center'
                    onClick={() => setShowMobileNav(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideRight {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.2s ease-out;
          }

          .animate-slideRight {
            animation: slideRight 0.2s ease-out;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3b82f6;
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    </>
  );
};

export default HeaderBottom;
