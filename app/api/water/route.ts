import { NextRequest, NextResponse } from 'next/server'

// Configuration - Update these with your ESP32 IP
const ESP32_IP = process.env.ESP32_IP || 'http://192.168.1.100:8080'
const PUMP_DURATION = 3000 // How long to run the pump (ms)
const TIMEOUT = 5000

interface WaterResponse {
  success: boolean
  message: string
  pumpDuration: number
}

export async function POST(request: NextRequest) {
  try {
    // Get pump duration from request body if provided
    const body = await request.json().catch(() => ({}))
    const duration = body.duration || PUMP_DURATION

    // Send water command to ESP32
    const response = await fetch(`${ESP32_IP}/water`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        duration: duration,
      }),
      timeout: TIMEOUT,
    }).catch(() => null)

    if (!response) {
      // Mock success if ESP32 is not available (for testing)
      console.warn('ESP32 not available, returning mock success')
      
      const mockResponse: WaterResponse = {
        success: true,
        message: 'Pump activated (mock)',
        pumpDuration: duration,
      }
      
      return NextResponse.json(mockResponse)
    }

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false,
          error: `ESP32 error: ${response.statusText}`,
          message: 'Failed to activate pump'
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    const waterResponse: WaterResponse = {
      success: true,
      message: data.message || 'Pump activated successfully',
      pumpDuration: duration,
    }

    return NextResponse.json(waterResponse)
  } catch (error) {
    console.error('Error activating pump:', error)
    
    // Return mock success for demo purposes
    const mockResponse: WaterResponse = {
      success: true,
      message: 'Pump activated (mock)',
      pumpDuration: PUMP_DURATION,
    }
    
    return NextResponse.json(mockResponse)
  }
}
