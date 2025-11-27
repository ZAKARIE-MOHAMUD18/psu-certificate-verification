import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react'

const VerifyCertificate = () => {
  const { uuid } = useParams()
  const [certificateId, setCertificateId] = useState(uuid || '')
  const [verificationResult, setVerificationResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (uuid) {
      handleVerify(uuid)
    }
  }, [uuid])

  const handleVerify = async (id = certificateId) => {
    if (!id.trim()) return

    setLoading(true)
    setHasSearched(true)
    
    try {
      const response = await api.get(`/api/certificates/${id}/verify`)
      setVerificationResult(response.data)
    } catch (error) {
      if (error.response?.status === 404) {
        setVerificationResult({
          status: 'NOT_FOUND',
          message: 'Certificate not found'
        })
      } else {
        setVerificationResult({
          status: 'ERROR',
          message: 'Verification failed. Please try again.'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleVerify()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'VALID':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'REVOKED':
        return <XCircle className="h-16 w-16 text-red-500" />
      case 'NOT_FOUND':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      default:
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALID':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'REVOKED':
        return 'text-red-700 bg-red-50 border-red-200'
      case 'NOT_FOUND':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      default:
        return 'text-red-700 bg-red-50 border-red-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">PSU</span>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
                <p className="text-sm text-gray-600">Puntland State University</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Verify Certificate
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter the certificate ID to verify its authenticity and status.
          </p>
          
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter certificate ID (UUID)"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !certificateId.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
              <span className="text-gray-600">Verifying certificate...</span>
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && !loading && (
          <div className={`border rounded-lg p-8 ${getStatusColor(verificationResult.status)}`}>
            <div className="flex flex-col items-center text-center">
              {getStatusIcon(verificationResult.status)}
              
              <h3 className="mt-4 text-xl font-semibold">
                {verificationResult.status === 'VALID' && 'Certificate Valid'}
                {verificationResult.status === 'REVOKED' && 'Certificate Revoked'}
                {verificationResult.status === 'NOT_FOUND' && 'Certificate Not Found'}
                {verificationResult.status === 'ERROR' && 'Verification Error'}
              </h3>
              
              <p className="mt-2 text-sm opacity-75">
                {verificationResult.message}
              </p>

              {verificationResult.status === 'REVOKED' && verificationResult.reason && (
                <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-md">
                  <p className="text-sm font-medium">Revocation Reason:</p>
                  <p className="text-sm">{verificationResult.reason}</p>
                </div>
              )}

              {verificationResult.certificate && (
                <div className="mt-6 w-full max-w-md">
                  <div className="bg-white bg-opacity-50 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-3">Certificate Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-medium">Student:</dt>
                        <dd>{verificationResult.certificate.student_name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Student ID:</dt>
                        <dd>{verificationResult.certificate.student_id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Degree:</dt>
                        <dd>{verificationResult.certificate.degree}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Program:</dt>
                        <dd>{verificationResult.certificate.program}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Issue Date:</dt>
                        <dd>{new Date(verificationResult.certificate.issue_date).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium">Issuer:</dt>
                        <dd>{verificationResult.certificate.issuer}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!hasSearched && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              How to Verify a Certificate
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>1. Enter the certificate ID (UUID) in the search box above</p>
              <p>2. Click "Verify" to check the certificate status</p>
              <p>3. The system will display whether the certificate is valid, revoked, or not found</p>
              <p>4. For valid certificates, you'll see the complete certificate details</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                QR Code Scanning
              </h4>
              <p className="text-sm text-blue-700">
                If you have a QR code on a physical certificate, scan it with your device's camera. 
                The QR code will automatically redirect you to this verification page with the certificate ID pre-filled.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyCertificate