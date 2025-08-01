import ImageUploader from "@/components/image-uploader";
import ImageGallery from "@/components/image-gallery";

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Uploady
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage your images with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ImageUploader />
          </div>
          <div className="lg:col-span-2">
            <ImageGallery />
          </div>
        </div>
      </div>
    </main>
  );
}
