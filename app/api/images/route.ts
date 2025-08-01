import { NextResponse } from "next/server"
import { imagekit } from "@/lib/imagekit"

export async function GET() {
    try {
        // Validate environment variables
        if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
            return NextResponse.json({
                error: "ImageKit configuration is missing"
            }, { status: 500 })
        }

        // Fetch images from ImageKit
        const result = await new Promise((resolve, reject) => {
            imagekit.listFiles({
                limit: 100, // Adjust as needed
                sort: 'DESC_CREATED' // Show newest first
            }, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })

        // console.log('Raw ImageKit response:', result)
        // console.log('Number of files found:', Array.isArray(result) ? result.length : 0)

        // Filter only image files and format the response
        const images = Array.isArray(result) ? result
            .filter(file => {
                // console.log('Processing file:', file.name, 'type:', file.type, 'mimeType:', file.mimeType)
                // More permissive filtering - check both type and mimeType
                return file.type === 'image' ||
                    (file.mimeType && file.mimeType.startsWith('image/')) ||
                    (file.name && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name))
            })
            .map(file => ({
                id: file.fileId,
                name: file.name,
                url: file.url,
                thumbnail: file.thumbnail,
                size: file.size,
                createdAt: file.createdAt,
                width: file.width,
                height: file.height,
                type: file.type,
                mimeType: file.mimeType
            })) : []

        // console.log('Filtered images:', images.length)

        return NextResponse.json({
            success: true,
            images,
            total: images.length,
            debug: {
                totalFilesFound: Array.isArray(result) ? result.length : 0,
                imageFilesFound: images.length,
                rawFiles: Array.isArray(result) ? result.map(f => ({ name: f.name, type: f.type, folder: f.folder })) : []
            }
        })

    } catch (error) {
        console.error('Error fetching images from ImageKit:', error)

        return NextResponse.json({
            error: "Failed to fetch images",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}