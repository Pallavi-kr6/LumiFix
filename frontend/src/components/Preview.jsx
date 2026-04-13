import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Download, Maximize2, Loader2 } from 'lucide-react'

const Preview = ({ originalImage, processedImage, processing }) => {
  const [showSplit, setShowSplit] = useState(true)
  const canvasRef = useRef()
  const originalUrlRef = useRef()
  const processedUrlRef = useRef()

  // Create preview URLs
  useEffect(() => {
    if (originalImage) {
      originalUrlRef.current = URL.createObjectURL(originalImage)
    }
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
    }
  }, [originalImage])

  useEffect(() => {
    if (processedImage) {
      processedUrlRef.current = `data:image/png;base64,${processedImage}`
    }
  }, [processedImage])

  const downloadProcessed = useCallback(() => {
    if (processedImage) {
      const link = document.createElement('a')
      link.download = 'lumifix-processed.png'
      link.href = processedUrlRef.current
      link.click()
    }
  }, [processedImage])

  const toggleSplitView = () => setShowSplit(!showSplit)

  if (!originalImage && !processing) {
    return (
      <motion.div 
        className="glass rounded-3xl p-12 text-center h-[500px] flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Maximize2 className="w-24 h-24 text-gray-600 mb-6 opacity-50" />
        <p className="text-2xl text-gray-500 font-medium">Upload image to see magic ✨</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Split toggle */}
      <motion.button
        onClick={toggleSplitView}
        className="glass w-full py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-3 glass-hover"
        whileTap={{ scale: 0.98 }}
      >
        <Maximize2 className="w-5 h-5" />
        {showSplit ? 'Full View' : 'Split Compare'}
      </motion.button>

      {/* Preview */}
      <div className="glass rounded-3xl p-6 overflow-hidden relative">
        {processing && (
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <p className="mt-4 text-lg font-medium">Processing your image...</p>
          </motion.div>
        )}

        <div className="relative h-[450px] rounded-2xl overflow-hidden bg-black/30">
          {showSplit ? (
            /* Split screen */
            <div className="flex h-full">
              {/* Original */}
              <div className="flex-1 relative bg-gradient-to-b from-gray-900/50 to-transparent">
                <img 
                  src={originalUrlRef.current} 
                  alt="Original"
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute -bottom-12 left-4 glass px-4 py-2 rounded-xl text-xs font-medium border">
                  Original
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-px bg-gradient-to-t from-transparent via-white/50 to-transparent self-stretch mx-px" />
              
              {/* Processed */}
              <div className="flex-1 relative bg-gradient-to-b from-purple-900/30 to-transparent">
                {processedImage ? (
                  <img 
                    src={processedUrlRef.current} 
                    alt="Processed"
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-gray-500 text-sm">Processing...</div>
                  </div>
                )}
                <div className="absolute -bottom-12 right-4 glass px-4 py-2 rounded-xl text-xs font-medium border">
                  LumiFix AI
                </div>
              </div>
            </div>
          ) : (
            /* Full processed view */
            processedImage ? (
              <img 
                src={processedUrlRef.current} 
                alt="Processed"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Preview will appear here
              </div>
            )
          )}
        </div>

        {/* Download */}
        {processedImage && (
          <motion.button
            onClick={downloadProcessed}
            className="glass w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 glass-hover"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            Download Processed Image
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default Preview

