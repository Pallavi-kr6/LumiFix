import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Sparkles } from 'lucide-react'

const presets = [
  { name: 'Original', params: {} },
  { name: 'Night Boost', params: { brightness: 1.2, contrast: 1.8, histogram_eq: true, sharpen_strength: 1.5 } },
  { name: 'HD Enhance', params: { histogram_eq: true, sharpen_strength: 2.0, contrast: 1.3 } },
  { name: 'Smooth', params: { gaussian_sigma: 1.5, bilateral_d: 15 } }
]

const Controls = ({ params, onParamsChange, processing }) => {
  const [localParams, setLocalParams] = useState(params)

  const handleSliderChange = (key, value) => {
    const newParams = { ...localParams, [key]: parseFloat(value) }
    setLocalParams(newParams)
    onParamsChange(newParams)
  }

  const applyPreset = (presetParams) => {
    const newParams = { ...localParams, ...presetParams }
    setLocalParams(newParams)
    onParamsChange(newParams)
  }

  const toggleHistogram = () => {
    const newParams = { ...localParams, histogram_eq: !localParams.histogram_eq }
    setLocalParams(newParams)
    onParamsChange(newParams)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass p-8 rounded-3xl space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="text-yellow-400" />
          Processing Controls
        </h3>
        
        {/* Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {presets.map((preset, idx) => (
            <motion.button
              key={preset.name}
              onClick={() => applyPreset(preset.params)}
              className="glass py-3 px-4 rounded-xl text-sm font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2 glass-hover"
              whileTap={{ scale: 0.98 }}
            >
              {idx === 0 ? 'O' : <Sparkles className="w-4 h-4" />}
              {preset.name}
            </motion.button>
          ))}
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brightness</label>
            <input 
              type="range" 
              min="0.3" max="2.0" step="0.05"
              value={localParams.brightness}
              onChange={(e) => handleSliderChange('brightness', e.target.value)}
              disabled={processing}
              className="slider"
            />
            <span className="text-sm text-gray-400">{localParams.brightness.toFixed(2)}x</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contrast</label>
            <input 
              type="range" 
              min="0.5" max="2.5" step="0.05"
              value={localParams.contrast}
              onChange={(e) => handleSliderChange('contrast', e.target.value)}
              disabled={processing}
              className="slider"
            />
            <span className="text-sm text-gray-400">{localParams.contrast.toFixed(2)}x</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sharpen</label>
            <input 
              type="range" 
              min="0" max="3" step="0.1"
              value={localParams.sharpen_strength}
              onChange={(e) => handleSliderChange('sharpen_strength', e.target.value)}
              disabled={processing}
              className="slider"
            />
            <span className="text-sm text-gray-400">{localParams.sharpen_strength.toFixed(1)}x</span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gaussian Blur</label>
            <input 
              type="range" 
              min="0" max="5" step="0.1"
              value={localParams.gaussian_sigma}
              onChange={(e) => handleSliderChange('gaussian_sigma', e.target.value)}
              disabled={processing}
              className="slider"
            />
            <span className="text-sm text-gray-400">σ={localParams.gaussian_sigma.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-3 p-3 glass rounded-xl">
            <input 
              type="checkbox" 
              id="histogram"
              checked={localParams.histogram_eq}
              onChange={toggleHistogram}
              className="w-5 h-5 accent-purple-500"
            />
            <label htmlFor="histogram" className="text-sm cursor-pointer select-none">
              Histogram Equalization
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Controls

