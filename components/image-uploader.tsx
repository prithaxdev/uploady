"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ImageIcon, UploadCloud, XCircle } from "lucide-react"
import Image from "next/image"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"

export default function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleUpload = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setUploadProgress(0)
      setUploadedImageUrl(null)
      setError(null)

      const formData = new FormData()
      formData.append("file", file)

      // Simulate process for demonstration
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        if (currentProgress <= 90) {
          setUploadProgress(currentProgress)
        } else {
          clearInterval(interval)
        }
      }, 100)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(interval) // Stop simulation once actual upload is done

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed.")
        }

        const data = await response.json()
        setUploadedImageUrl(data.url)
        setUploadProgress(100)
        toast.success("Upload successful", {
          description: "Your image has been uploaded.",
        })

        // Dispatch custom event to refresh gallery
        window.dispatchEvent(new CustomEvent('imageUploaded'))
      } catch (err: any) {
        setError(err.message || "An unknown error occurred during upload.")
        setUploadProgress(0)
        toast.error("Upload failed", {
          description: err.message || "Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        const file = files[0]
        if (!file.type.startsWith("image/")) {
          setError('Please upload an image file.')
          toast.error("Invalid file type", {
            description: "Please upload an image file (e.g., JPG, PNG, GIF.)",
          })
          return
        }
        setError(null)
        handleUpload(file)
      }
    }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      handleFileChange(e.dataTransfer.files)
    },
    [handleFileChange]
  )

  const handleRemoveImage = useCallback(() => {
    setUploadedImageUrl(null)
    setUploadProgress(0)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear the file input
    }
    toast.success("Image removed", {
      description: "The uploaded image has been cleared.",
    })
  }, [])


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5" /> Image Uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center transition-colors duration-200
                ${isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"}
                ${uploadedImageUrl ? "hidden" : "block"}
              `}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Drag and drop your image here, or</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse files
          </Button>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFileChange(e.target.files)}
            ref={fileInputRef}
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>

        {isLoading && uploadProgress > 0 && (
          <div className="w-full mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-center text-sm text-gray-500 mt-2">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {uploadedImageUrl && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <Image
              src={uploadedImageUrl || "/placeholder.svg"}
              alt="Uploaded image"
              fill
              style={{ objectFit: "contain" }}
              className={`transition-all duration-300 ${isLoading ? "blur-sm" : "blur-0"}`}
              onLoad={() => setIsLoading(false)} // Ensure blur is removed once image is loaded in browser
            />
            <div className="absolute top-2 right-2 flex gap-2">
              {" "}
              {/* Added a div to group buttons */}
              <Button
                variant="secondary" // Changed to secondary for distinction
                size="icon"
                className="rounded-full bg-background/80 hover:bg-background"
                onClick={() => window.open(uploadedImageUrl!, "_blank")} // Open in new tab
                aria-label="View image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-external-link w-5 h-5"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 hover:bg-background"
                onClick={handleRemoveImage}
                aria-label="Remove image"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </Button>
            </div>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <ImageIcon className="w-10 h-10 animate-pulse text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )

}
