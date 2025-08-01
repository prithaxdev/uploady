import ImageKit from "imagekit"

// Initialize ImageKit with your credentials
// These should be stored as environment variables for production
// For local development, you can use a .env.local file

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!, // Keep this secure!
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

/**
 * Uploads a file to ImageKit.
 * This function is intended to be called from a secure server-side environment (e.g., Next.js API route).
 * @param file The file data (e.g., base64 string or Buffer).
 * @param fileName The desired file name on ImageKit.
 * @param folder The folder path on ImageKit (optional).
 * @returns The ImageKit upload response.
 */

export async function uploadFileToImageKit(file: string | Buffer, fileName: string, folder?: string) {
  // Validate environment variables
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    console.error("Missing ImageKit environment variables:", {
      publicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT
    })
    throw new Error("ImageKit configuration is missing. Please check your environment variables.")
  }

  try {
    console.log("Attempting to upload to ImageKit:", {
      fileName,
      folder,
      fileSize: Buffer.isBuffer(file) ? file.length : file.length
    })

    const response = await imagekit.upload({
      file,
      fileName,
      folder,
    })

    console.log("ImageKit upload successful:", response.url)
    return response
  } catch (error) {
    console.error("Error uploading to ImageKit:", error)

    // Provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('Invalid key')) {
        throw new Error("Invalid ImageKit API keys. Please check your credentials.")
      }
      if (error.message.includes('authentication')) {
        throw new Error("ImageKit authentication failed. Please verify your API keys.")
      }
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new Error("Network error while uploading to ImageKit. Please try again.")
      }
      throw new Error(`ImageKit upload failed: ${error.message}`)
    }

    throw new Error("Failed to upload image to ImageKit.")
  }
}
