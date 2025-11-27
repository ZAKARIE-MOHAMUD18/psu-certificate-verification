import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import CertificateList from './pages/CertificateList'
import NewCertificate from './pages/NewCertificate'
import CertificateDetails from './pages/CertificateDetails'
import VerifyCertificate from './pages/VerifyCertificate'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/certificates" element={
              <ProtectedRoute>
                <CertificateList />
              </ProtectedRoute>
            } />
            <Route path="/admin/certificates/new" element={
              <ProtectedRoute>
                <NewCertificate />
              </ProtectedRoute>
            } />
            <Route path="/admin/certificates/:id" element={
              <ProtectedRoute>
                <CertificateDetails />
              </ProtectedRoute>
            } />
            <Route path="/verify/:uuid" element={<VerifyCertificate />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/" element={<VerifyCertificate />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App