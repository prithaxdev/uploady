"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, RefreshCw, ExternalLink, Download } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface ImageData {
    id: string
    name: string
    url: string
    thumbnail?: string
    size: number
    createdAt: string
    width?: number
    height?: number
}

export default function ImageGallery() {
    const [images, setImages] = useState<ImageData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

    const fetchImages = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch("/api/images")

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to fetch images")
            }

            const data = await response.json()
            setImages(data.images || [])

            if (data.images?.length === 0) {
                toast.info("No images found", {
                    description: "Upload some images to see them here.",
                })
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching images")
            toast.error("Failed to load images", {
                description: err.message || "Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchImages()

        // Listen for image upload events to refresh gallery
        const handleImageUploaded = () => {
            fetchImages()
        }

        window.addEventListener('imageUploaded', handleImageUploaded)

        return () => {
            window.removeEventListener('imageUploaded', handleImageUploaded)
        }
    }, [fetchImages])

    const handleImageLoad = useCallback((imageId: string) => {
        setLoadingImages(prev => {
            const newSet = new Set(prev)
            newSet.delete(imageId)
            return newSet
        })
    }, [])

    const handleImageLoadStart = useCallback((imageId: string) => {
        setLoadingImages(prev => new Set(prev).add(imageId))
    }, [])

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)

            toast.success("Download started", {
                description: `Downloading ${filename}`,
            })
        } catch (error) {
            toast.error("Download failed", {
                description: "Could not download the image.",
            })
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> Image Gallery
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading images...</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> Image Gallery
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center gap-4 py-12">
                        <p className="text-red-500">{error}</p>
                        <Button onClick={fetchImages} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Image Gallery
                    {images.length > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                            ({images.length} {images.length === 1 ? 'image' : 'images'})
                        </span>
                    )}
                </CardTitle>
                <div className="flex gap-2">
                    <Button onClick={fetchImages} variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => window.open('/api/images', '_blank')}
                        variant="outline"
                        size="sm"
                    >
                        Debug API
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {images.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        <div className="text-center">
                            <p className="text-muted-foreground">No images found</p>
                            <p className="text-sm text-muted-foreground">Upload some images to see them here</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="group relative bg-muted rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                            >
                                <div className="relative aspect-square">
                                    <Image
                                        src={image.thumbnail || image.url}
                                        alt={image.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        className={`transition-all duration-300 ${loadingImages.has(image.id) ? "blur-sm scale-110" : "blur-0 scale-100"
                                            }`}
                                        onLoadStart={() => handleImageLoadStart(image.id)}
                                        onLoad={() => handleImageLoad(image.id)}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />

                                    {/* Loading overlay */}
                                    {loadingImages.has(image.id) && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    )}

                                    {/* Hover overlay with actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => window.open(image.url, "_blank")}
                                            className="bg-background/80 hover:bg-background"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => handleDownload(image.url, image.name)}
                                            className="bg-background/80 hover:bg-background"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Image info */}
                                <div className="p-3">
                                    <p className="text-sm font-medium truncate" title={image.name}>
                                        {image.name}
                                    </p>
                                    <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                                        <span>{formatFileSize(image.size)}</span>
                                        <span>{formatDate(image.createdAt)}</span>
                                    </div>
                                    {image.width && image.height && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {image.width} × {image.height}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}