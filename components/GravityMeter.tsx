'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface SoilData {
  moisture: number
  isPumping: boolean
}

export default function GravityMeter() {
  const [soilData, setSoilData] = useState<SoilData>({
    moisture: 50,
    isPumping: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Configuration
  const ESP32_IP = process.env.NEXT_PUBLIC_ESP32_IP || 'localhost:8080'
  const POLL_INTERVAL = 2000 // Poll every 2 seconds

  // Fetch soil moisture data
  const fetchSoilStatus = async () => {
    try {
      const response = await axios.get(`/api/soil-status`)
      setSoilData(response.data)
      setError(null)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching soil status:', err)
      setError('Failed to fetch soil status')
    }
  }

  // Handle water button click
  const handleWater = async () => {
    setLoading(true)
    try {
      await axios.post(`/api/water`)
      setSoilData(prev => ({ ...prev, isPumping: true }))
      setError(null)
      // Re-fetch after pump runs
      setTimeout(() => {
        fetchSoilStatus()
      }, 3000)
    } catch (err) {
      console.error('Error watering:', err)
      setError('Failed to activate pump')
    } finally {
      setLoading(false)
    }
  }

  // Fetch soil status on mount and set up polling
  useEffect(() => {
    fetchSoilStatus()
    const interval = setInterval(fetchSoilStatus, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Calculate icon position based on moisture level
  // When moisture is high (wet), icon floats up (top: 0)
  // When moisture is low (dry), icon falls down (top: 100%)
  const iconPosition = 100 - soilData.moisture

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gravity Meter</h1>
          <p className="text-gray-600">Soil Moisture Monitor</p>
        </div>

        {/* Gravity Container */}
        <div className="relative w-full h-80 bg-gradient-to-b from-sky-100 to-sky-50 rounded-xl border-4 border-gray-300 overflow-hidden mb-8 shadow-inner">
          {/* Falling/Floating Icon */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out ${
              soilData.isPumping ? 'animate-bounce' : ''
            }`}
            style={{
              top: `${iconPosition}%`,
            }}
          >
            <div className="text-6xl">
              {soilData.moisture > 70 ? '✨' : '💧'}
            </div>
          </div>

          {/* Dry Zone Indicator */}
          {soilData.moisture < 40 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              DRY!
            </div>
          )}

          {/* Wet Zone Indicator */}
          {soilData.moisture > 80 && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              WET
            </div>
          )}

          {/* Ground Line */}
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-b from-yellow-200 to-yellow-700 border-t-2 border-yellow-800">
            <div className="text-center text-2xl pt-1">🌱</div>
          </div>
        </div>

        {/* Moisture Level Display */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-lg font-semibold text-gray-700">
              Moisture Level
            </label>
            <span className="text-2xl font-bold text-blue-600">
              {soilData.moisture}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 h-full transition-all duration-500"
              style={{ width: `${soilData.moisture}%` }}
            />
          </div>
        </div>

        {/* Status Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Pump Status</p>
            <p className="text-lg font-bold text-blue-600">
              {soilData.isPumping ? '🔵 ON' : '⚫ OFF'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Last Update</p>
            <p className="text-sm font-semibold text-gray-700">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Water Button */}
        <button
          onClick={handleWater}
          disabled={loading || soilData.isPumping}
          className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            loading || soilData.isPumping
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Watering...
            </>
          ) : soilData.isPumping ? (
            <>
              <span className="animate-bounce">💨</span>
              Pump Active
            </>
          ) : (
            <>
              <span>💧</span>
              Water Now
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>
            💡 <strong>How it works:</strong> Click "Water Now" to activate the pump. The icon will float back up as soil moisture increases!
          </p>
        </div>
      </div>
    </div>
  )
}
