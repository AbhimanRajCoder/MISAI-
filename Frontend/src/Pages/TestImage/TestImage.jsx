import React, { useState } from 'react'
import './TestImage.css'
import Navbar from '../Navbar/Navbar'

const TestImage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResults(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedImage) {
      setError('Please select an image to verify')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      
      const response = await fetch(`${import.meta.env.VITE_HOST_URL}/testimage`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(`Failed to verify image: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderVerificationResult = () => {
    if (!results) return null

    const isAuthentic = results.authentic
    const confidenceScore = results.confidence_score || 0
    const gradientClass = isAuthentic ? 'authentic-gradient' : 'manipulated-gradient'
    
    return (
      <div className="verification-result">
        <div className={`result-banner ${gradientClass}`}>
          <h3>{isAuthentic ? 'Authentic Image' : 'Manipulated Image'}</h3>
          <div className="confidence-meter">
            <div 
              className="confidence-bar" 
              style={{ width: `${confidenceScore * 100}%` }}
            ></div>
            <span className="confidence-value">{(confidenceScore * 100).toFixed(1)}% Confidence</span>
          </div>
        </div>
        
        {results.analysis && (
          <div className="analysis-section">
            <h3>Analysis</h3>
            <p>{results.analysis}</p>
          </div>
        )}
        
        {results.manipulated_regions && (
          <div className="regions-section">
            <h3>Detected Manipulations</h3>
            <ul className="regions-list">
              {results.manipulated_regions.map((region, index) => (
                <li key={index} className="region-item">
                  <span className="region-type">{region.type}</span>
                  <span className="region-confidence">{(region.confidence * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
   <Navbar/>
    <div className="testimage-container">
      <h1>Image Verification Tool</h1>
      <p className="description">
        Upload an image to verify its authenticity and detect potential manipulations.
      </p>
      
      <div className={`image-verification-area ${results ? 'with-results' : 'no-results'}`}>
        <div className="upload-section">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="change-image-btn"
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                      setResults(null)
                    }}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <label htmlFor="image-upload" className="upload-label">
                    <div className="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                    <span>Click to upload an image</span>
                    <span className="upload-hint">JPG, PNG or GIF (max 10MB)</span>
                  </label>
                  <input 
                    type="file" 
                    id="image-upload" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="file-input"
                  />
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="verify-button"
              disabled={loading || !selectedImage}
            >
              {loading ? 'Verifying...' : 'Verify Image'}
            </button>
          </form>
          
          {(results || loading || error) && (
            <div className="results-section">
              {error && <div className="error-message">{error}</div>}
              {loading && <div className="loading-indicator">Analyzing image...</div>}
              {renderVerificationResult()}
            </div>
          )}
        </div>
      </div>
    </div>
        </>
  )
}

export default TestImage
