# Uploady - Image Uploader

A modern, responsive image uploader built with Next.js 15, TypeScript, and ImageKit. Features drag-and-drop functionality, progress tracking, and dark mode support.

## Features

- 🖼️ Drag and drop image upload
- 📊 Real-time upload progress
- 🌙 Dark/Light mode support
- 📱 Responsive design
- ✅ File type and size validation
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- ☁️ ImageKit integration for optimized image delivery

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Image Service**: ImageKit
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- ImageKit account ([Sign up here](https://imagekit.io/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd uploady
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure ImageKit in your `.env` file:
```env
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key_here
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

To get these values:
- Go to your [ImageKit Dashboard](https://imagekit.io/dashboard)
- Navigate to Developer Options
- Copy your Public Key, Private Key, and URL Endpoint

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Images**: Drag and drop images onto the upload area or click "Browse files"
2. **View Progress**: Watch the upload progress bar in real-time
3. **View Images**: Successfully uploaded images are displayed with options to view in full size or remove
4. **Theme Toggle**: The app automatically adapts to your system theme preference

## File Validation

- **Supported formats**: JPG, PNG, GIF, WebP, and other image formats
- **Maximum file size**: 10MB
- **File type validation**: Only image files are accepted

## Project Structure

```
├── app/
│   ├── api/upload/          # Upload API endpoint
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout with theme provider
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── image-uploader.tsx   # Main upload component
│   └── theme-provider.tsx   # Theme provider wrapper
├── lib/
│   ├── imagekit.ts          # ImageKit configuration
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## API Endpoints

### POST /api/upload

Uploads an image file to ImageKit.

**Request**: FormData with `file` field
**Response**: ImageKit upload response with image URL

**Validation**:
- File must be an image
- File size must be ≤ 10MB
- Filename is sanitized for security

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to set the environment variables in your deployment platform:
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY` 
- `IMAGEKIT_URL_ENDPOINT`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/uploady/issues) on GitHub.
