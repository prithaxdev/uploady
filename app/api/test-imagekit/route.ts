import { NextResponse } from "next/server"
import { imagekit } from "@/lib/imagekit"

export async function GET() {
    try {
        // Test ImageKit configuration
        console.log('Testing ImageKit configuration...')
        console.log('Environment variables check:')
        console.log('IMAGEKIT_PUBLIC_KEY:', !!process.env.IMAGEKIT_PUBLIC_KEY)
        console.log('IMAGEKIT_PRIVATE_KEY:', !!process.env.IMAGEKIT_PRIVATE_KEY)
        console.log('IMAGEKIT_URL_ENDPOINT:', !!process.env.IMAGEKIT_URL_ENDPOINT)

        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            return NextResponse.json({
                error: "ImageKit configuration is missing",
                details: {
                    publicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
                    privateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
                    urlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT
                }
            }, { status: 500 })
        }

        // Test authentication by listing files
        const result = await new Promise((resolve, reject) => {
            imagekit.listFiles({ limit: 1 }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })

        return NextResponse.json({
            success: true,
            message: "ImageKit authentication successful!",
            endpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            filesFound: Array.isArray(result) ? result.length : 0
        })

    } catch (error) {
        console.error('ImageKit test failed:', error)

        return NextResponse.json({
            error: "ImageKit authentication failed",
            details: error instanceof Error ? error.message : "Unknown error",
            suggestions: [
                "Check if your private key is complete and correct",
                "Verify your public key",
                "Ensure your URL endpoint is correct",
                "Check network connectivity"
            ]
        }, { status: 500 })
    }
}