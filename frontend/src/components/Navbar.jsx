import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Home, FileText, Plus, Menu, X } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PSU</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Certificate System</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-100"
            >
              <Home size={16} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/certificates"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-100"
            >
              <FileText size={16} />
              <span>Certificates</span>
            </Link>

            <Link
              to="/admin/certificates/new"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
            >
              <Plus size={16} />
              <span>New Certificate</span>
            </Link>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-100"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with slide-down animation */}
      <div
        ref={menuRef}
        className={`md:hidden bg-white shadow-inner overflow-hidden transition-max-height duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-100"
          >
            <Home size={16} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/certificates"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-100"
          >
            <FileText size={16} />
            <span>Certificates</span>
          </Link>

          <Link
            to="/admin/certificates/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            <Plus size={16} />
            <span>New Certificate</span>
          </Link>

          <div className="flex flex-col space-y-1 mt-2 px-3">
            <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={() => { logout(); setIsOpen(false) }}
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-100"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
