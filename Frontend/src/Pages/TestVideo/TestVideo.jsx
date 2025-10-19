import React, { useState, useRef } from 'react'
import './TestVideo.css'
import Navbar from '../Navbar/Navbar'

const TestVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedVideo(file)
      setVideoPreview(URL.createObjectURL(file))
      setResults(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedVideo) {
      setError('Please select a video to verify')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('video', selectedVideo)
      
      const response = await fetch(`${import.meta.env.VITE_HOST_URL}/testvideo`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(`Failed to verify video: ${err.message}`)
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
          <h3>{isAuthentic ? 'Authentic Video' : 'Manipulated Video'}</h3>
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
        
        {results.manipulated_segments && (
          <div className="segments-section">
            <h3>Detected Manipulations</h3>
            <ul className="segments-list">
              {results.manipulated_segments.map((segment, index) => (
                <li key={index} className="segment-item">
                  <span className="segment-type">{segment.type}</span>
                  <span className="segment-time">{formatTime(segment.start_time)} - {formatTime(segment.end_time)}</span>
                  <span className="segment-confidence">{(segment.confidence * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <Navbar/>
      <div className="testvideo-container">
        <h1>Video Verification Tool</h1>
        <p className="description">
          Upload a video to verify its authenticity and detect potential manipulations.
        </p>
        
        <div className={`video-verification-area ${results ? 'with-results' : 'no-results'}`}>
          <div className="upload-section">
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="video-upload-container">
                {videoPreview ? (
                  <div className="video-preview-container">
                    <video 
                      ref={videoRef}
                      src={videoPreview} 
                      controls 
                      className="video-preview"
                    />
                    <button 
                      type="button" 
                      className="change-video-btn"
                      onClick={() => {
                        setSelectedVideo(null)
                        setVideoPreview(null)
                        setResults(null)
                      }}
                    >
                      Change Video
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <label htmlFor="video-upload" className="upload-label">
                      <div className="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                      </div>
                      <span>Click to upload a video</span>
                      <span className="upload-hint">MP4, MOV or AVI (max 100MB)</span>
                    </label>
                    <input 
                      type="file" 
                      id="video-upload" 
                      accept="video/*" 
                      onChange={handleVideoChange} 
                      className="file-input"
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="verify-button"
                disabled={loading || !selectedVideo}
              >
                {loading ? 'Verifying...' : 'Verify Video'}
              </button>
            </form>
            
            {(results || loading || error) && (
              <div className="results-section">
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading-indicator">Analyzing video...</div>}
                {renderVerificationResult()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TestVideo