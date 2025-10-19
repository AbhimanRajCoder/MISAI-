import React, { useState, useEffect } from 'react'
import './TestAI.css'
import Navbar from '../Navbar/Navbar'

const TestAI = () => {
  const [selectedModel, setSelectedModel] = useState('');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableModels, setAvailableModels] = useState([
    'gpt-3.5-turbo',
    'gpt-4',
    'claude-3-opus',
    'claude-3-sonnet',
    'llama-3'
  ]);

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedModel || !inputText.trim()) {
      setError('Please select a model and enter text to test');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_HOST_URL}/testai/${selectedModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(`Failed to test AI: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    <Navbar/>

    <div className="testai-container">
      <h1>Test Your AI Fact-Checker</h1>
      <p className="description">
        Test and certify AI fact-checkers using structured misinformation scenarios.
        Select a model and input text to evaluate its hallucination score and reliability.
      </p>
      
      <form onSubmit={handleSubmit} className="test-form">
        <div className="form-group">
          <label htmlFor="model-select">Select AI Model:</label>
          <select 
            id="model-select" 
            value={selectedModel} 
            onChange={handleModelChange}
            className="model-select"
          >
            <option value="">-- Select a model --</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="test-input">Test Input:</label>
          <textarea
            id="test-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to test the AI model for factual accuracy..."
            rows={5}
            className="test-input"
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test AI'}
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      {results && (
        <div className="results-container">
          <h2>Test Results</h2>
          
          <div className="result-card">
            <h3>Hallucination Score</h3>
            <div className="score-display">
              <div 
                className="score-meter" 
                style={{ 
                  '--score': `${results.hallucination_score * 100}%`,
                  '--color': results.hallucination_score > 0.7 ? 'red' : 
                             results.hallucination_score > 0.3 ? 'orange' : 'green'
                }}
              >
                <span className="score-value">{(results.hallucination_score * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="metrics-grid">
            {results.metrics && Object.entries(results.metrics).map(([key, value]) => (
              <div key={key} className="metric-card">
                <h4>{key.replace(/_/g, ' ')}</h4>
                <p className="metric-value">{typeof value === 'number' ? value.toFixed(2) : value}</p>
              </div>
            ))}
          </div>
          
          {results.analysis && (
            <div className="analysis-section">
              <h3>Analysis</h3>
              <p>{results.analysis}</p>
            </div>
          )}
        </div>
      )}
    </div>
        </>
  )
}

export default TestAI
