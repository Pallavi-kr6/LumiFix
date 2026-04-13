import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

const ImageUpload = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      onUpload(file)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] },
    maxFiles: 1
  })

  return (
    <motion.div
      {...getRootProps()}
      className="glass p-12 rounded-3xl text-center cursor-pointer glass-hover min-h-[300px] flex flex-col items-center justify-center"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-20 h-20 text-purple-400 mx-auto mb-6 opacity-75" />
      <div>
        {isDragActive ? (
          <p className="text-2xl font-semibold text-purple-300 drop-shadow-lg">
            Drop image here...
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Drag & Drop or Click
            </p>
            <p className="text-gray-400 text-lg">PNG, JPG, WebP up to 10MB</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ImageUpload

