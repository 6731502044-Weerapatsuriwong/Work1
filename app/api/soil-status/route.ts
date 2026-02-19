import { NextRequest, NextResponse } from 'next/server'

// Configuration - Update these with your ESP32 IP
const ESP32_IP = process.env.ESP32_IP || 'http://192.168.1.100:8080'
const POLL_TIMEOUT = 5000

interface SoilStatusResponse {
  moisture: number
  isPumping: boolean
  temperature?: number
  timestamp: string
}

export async function GET(request: NextRequest) {
  try {
    // Get soil status from ESP32
    const response = await fetch(`${ESP32_IP}/status`, {
      method: 'GET',
      timeout: POLL_TIMEOUT,
    }).catch(() => null)

    if (!response) {
      // Return mock data if ESP32 is not available (for testing)
      console.warn('ESP32 not available, returning mock data')
      
      const mockData: SoilStatusResponse = {
        moisture: Math.floor(Math.random() * 100),
        isPumping: false,
        temperature: 22.5,
        timestamp: new Date().toISOString(),
      }
      
      return NextResponse.json(mockData)
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `ESP32 error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    const soilData: SoilStatusResponse = {
      moisture: data.moisture || 50,
      isPumping: data.pumping || false,
      temperature: data.temperature,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(soilData)
  } catch (error) {
    console.error('Error fetching soil status:', error)
    
    // Return mock data for demo purposes
    const mockData: SoilStatusResponse = {
      moisture: Math.floor(Math.random() * 100),
      isPumping: false,
      timestamp: new Date().toISOString(),
    }
    
    return NextResponse.json(mockData)
  }
}
