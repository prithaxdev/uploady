import { uploadFileToImageKit } from "@/lib/imagekit"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 10MB." }, { status: 400 })
    }

    // Convert file to Buffer for ImageKit upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${Date.now()}-${sanitizedName}`

    const uploadResponse = await uploadFileToImageKit(buffer, fileName, "/uploads")

    return NextResponse.json(uploadResponse, { status: 200 })
  } catch (error) {
    console.error('API error:', error)

    // Return more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("ImageKit configuration")) {
        return NextResponse.json({ error: "Server configuration error. Please contact support." }, { status: 500 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
