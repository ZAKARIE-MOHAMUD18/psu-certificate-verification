import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Home, FileText, Plus } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PSU</span>
              </div>
              <span className="font-bold text-xl text-gray-800">Certificate System</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar