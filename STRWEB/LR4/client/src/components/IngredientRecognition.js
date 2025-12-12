import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { aiAPI } from '../utils/api';
import './IngredientRecognition.css';

// Functional component for AI image recognition
function IngredientRecognition() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Event Handler 29: onImageSelect
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setSelectedImage(file);
      setError('');
      setAnalysis('');

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Event Handler 30: onAnalyzeImage (AI API call with image)
  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await aiAPI.recognizeIngredients(selectedImage);
      setAnalysis(response.data.analysis);
    } catch (err) {
      console.error('Image recognition error:', err);
      setError(err.response?.data?.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  // Event Handler 31: onClearImage
  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Event Handler 32: onDragOver
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Event Handler 33: onDrop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      handleImageSelect({ target: { files: [file] } });
    } else {
      setError('Please drop a valid image file');
    }
  };

  return (
    <div className="ingredient-recognition">
      <div className="recognition-header">
        <h1>🔍 AI Ingredient Recognition</h1>
        <p>Upload a photo of ingredients and let AI identify them for you!</p>
      </div>

      <div className="recognition-content">
        <div 
          className="upload-section"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!imagePreview ? (
            <div className="upload-area">
              <div className="upload-icon">📸</div>
              <h3>Drop an image here or click to browse</h3>
              <p>Supports: JPG, PNG, GIF (Max 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="btn btn-primary">
                Choose Image
              </label>
            </div>
          ) : (
            <div className="image-preview-section">
              <div className="image-preview">
                <img src={imagePreview} alt="Selected" />
              </div>
              <div className="image-actions">
                <button 
                  onClick={handleAnalyzeImage} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    '🤖 Analyze Ingredients'
                  )}
                </button>
                <button 
                  onClick={handleClearImage} 
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Clear Image
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {analysis && (
          <div className="analysis-section">
            <h2>Analysis Results:</h2>
            <div className="markdown-content analysis-content">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}

        {!analysis && !imagePreview && (
          <div className="info-section">
            <h3>How it works:</h3>
            <ul>
              <li>📷 Upload a photo of pizza ingredients</li>
              <li>🤖 AI analyzes and identifies the ingredients</li>
              <li>📋 Get suggestions for pizza types you can make</li>
              <li>✨ Receive preparation tips and quality notes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientRecognition;
