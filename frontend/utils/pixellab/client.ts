/**
 * PixelLab AI API Client
 * Documentation: https://api.pixellab.ai/v1/docs
 */

export interface PixelLabGenerateImageOptions {
    prompt: string
    width?: number
    height?: number
    transparent?: boolean
    seed?: number
    num_inference_steps?: number
    guidance_scale?: number
}

export interface PixelLabImageResponse {
    image_url: string
    seed: number
}

export class PixelLabClient {
    private apiKey: string
    private baseUrl = 'https://api.pixellab.ai/v1'

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_PIXELLAB_API_KEY || ''

        if (!this.apiKey) {
            throw new Error('PixelLab API key is required. Set NEXT_PUBLIC_PIXELLAB_API_KEY environment variable.')
        }
    }

    /**
     * Generate pixel art image from text description using PixFlux model
     */
    async generateImage(options: PixelLabGenerateImageOptions): Promise<PixelLabImageResponse> {
        const response = await fetch(`${this.baseUrl}/generate-image-pixflux`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: options.prompt,
                width: options.width || 512,
                height: options.height || 512,
                transparent: options.transparent ?? true,
                seed: options.seed,
                num_inference_steps: options.num_inference_steps || 20,
                guidance_scale: options.guidance_scale || 7.5
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(`PixelLab API error: ${error.message || response.statusText}`)
        }

        return await response.json()
    }

    /**
     * Generate pixel art with style transfer using BitForge model
     */
    async generateImageBitForge(options: PixelLabGenerateImageOptions): Promise<PixelLabImageResponse> {
        const response = await fetch(`${this.baseUrl}/generate-image-bitforge`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: options.prompt,
                width: options.width || 512,
                height: options.height || 512,
                transparent: options.transparent ?? true,
                seed: options.seed,
                num_inference_steps: options.num_inference_steps || 20,
                guidance_scale: options.guidance_scale || 7.5
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(`PixelLab API error: ${error.message || response.statusText}`)
        }

        return await response.json()
    }

    /**
     * Rotate a pixel art image
     */
    async rotate(imageUrl: string, angle: number): Promise<PixelLabImageResponse> {
        const response = await fetch(`${this.baseUrl}/rotate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                angle
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(`PixelLab API error: ${error.message || response.statusText}`)
        }

        return await response.json()
    }

    /**
     * Generate 4-frame animation from text description
     */
    async animateWithText(prompt: string, width?: number, height?: number): Promise<{ frames: string[] }> {
        const response = await fetch(`${this.baseUrl}/animate-with-text`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                width: width || 512,
                height: height || 512
            })
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }))
            throw new Error(`PixelLab API error: ${error.message || response.statusText}`)
        }

        return await response.json()
    }
}

// Singleton instance
let pixelLabClient: PixelLabClient | null = null

export function getPixelLabClient(): PixelLabClient {
    if (!pixelLabClient) {
        pixelLabClient = new PixelLabClient()
    }
    return pixelLabClient
}
