import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Download, Ban, CheckCircle, XCircle } from 'lucide-react'

const CertificateDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [certificate, setCertificate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRevokeModal, setShowRevokeModal] = useState(false)
  const [revokeReason, setRevokeReason] = useState('')
  const [revoking, setRevoking] = useState(false)

  useEffect(() => {
    fetchCertificate()
    if (searchParams.get('action') === 'revoke') {
      setShowRevokeModal(true)
    }
  }, [id])

  const fetchCertificate = async () => {
    try {
      const response = await api.get(`/api/certificates/${id}`)
      setCertificate(response.data)
    } catch (error) {
      console.error('Failed to fetch certificate:', error)
      toast.error('Certificate not found')
      navigate('/admin/certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/certificates/${id}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `certificate_${id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error('Failed to download certificate')
    }
  }

  const handleRevoke = async () => {
    if (!revokeReason.trim()) {
      toast.error('Please provide a reason for revocation')
      return
    }

    setRevoking(true)
    try {
      await api.post(`/api/certificates/${id}/revoke`, {
        reason: revokeReason
      })
      toast.success('Certificate revoked successfully')
      setShowRevokeModal(false)
      fetchCertificate()
    } catch (error) {
      toast.error('Failed to revoke certificate')
    } finally {
      setRevoking(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!certificate) {
    return null
  }

  return (
    <div>
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin/certificates')}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Certificate Details</h1>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {certificate.revoked ? (
                    <XCircle className="h-6 w-6 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  )}
                  <span className={`text-lg font-medium ${
                    certificate.revoked ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {certificate.revoked ? 'Revoked' : 'Valid'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  {!certificate.revoked && (
                    <button
                      onClick={() => setShowRevokeModal(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{certificate.uuid}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Issue Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(certificate.issue_date).toLocaleDateString()}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Student Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.student.name}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.student.student_id}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Degree</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.degree}</dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Program</dt>
                  <dd className="mt-1 text-sm text-gray-900">{certificate.program}</dd>
                </div>

                {certificate.student.email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{certificate.student.email}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(certificate.created_at).toLocaleString()}
                  </dd>
                </div>

                {certificate.revoked && certificate.revoked_reason && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Revocation Reason</dt>
                    <dd className="mt-1 text-sm text-red-700">{certificate.revoked_reason}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500">Verification URL</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a
                    href={`/verify/${certificate.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    {window.location.origin}/verify/{certificate.uuid}
                  </a>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Revoke Certificate
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for revoking this certificate. This action cannot be undone.
              </p>
              <textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="Enter revocation reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {revoking ? 'Revoking...' : 'Revoke Certificate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificateDetails