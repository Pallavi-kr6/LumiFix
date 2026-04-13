import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Zap, Download, Maximize2 } from 'lucide-react'
import ImageUpload from './components/ImageUpload'
import Controls from './components/Controls'
import Preview from './components/Preview'

function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [params, setParams] = useState({
    brightness: 1.0,
    contrast: 1.0,
    gaussian_sigma: 0,
    bilateral_d: 9,
    sharpen_strength: 0,
    histogram_eq: false
  })

  const handleParamsChange = useCallback((newParams) => {
    setParams(newParams)
    if (originalImage) {
      // Trigger processing
      handleProcessImage(originalImage, newParams)
    }
  }, [originalImage])

  const handleProcessImage = async (imageFile, processParams) => {
    setProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('params', JSON.stringify(processParams))
      
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (data.success) {
        setProcessedImage(data.processed_image)
      }
    } catch (error) {
      console.error('Processing error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const handleImageUpload = useCallback((imageFile) => {
    setOriginalImage(imageFile)
    setProcessedImage(null)
    // Initial process with default params
    handleProcessImage(imageFile, params)
  }, [params, handleProcessImage])

  return (
    <div className="min-h-screen p-6 lg:p-12">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          LumiFix AI
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Professional Digital Image Processing powered by AI & OpenCV
        </p>
      </motion.header>

      <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Upload & Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <ImageUpload onUpload={handleImageUpload} />
          <Controls 
            params={params} 
            onParamsChange={handleParamsChange}
            processing={processing}
          />
        </motion.div>

        {/* Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Preview 
            originalImage={originalImage}
            processedImage={processedImage}
            processing={processing}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default App

