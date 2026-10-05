import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  mp4: 'video/mp4',
  pdf: 'application/pdf',
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params

    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File path not provided', { status: 400 })
    }

    // Security: cegah directory traversal
    for (const segment of pathSegments) {
      if (segment.includes('..') || segment.includes('/') || segment.includes('\\')) {
        return new NextResponse('Invalid path segment', { status: 400 })
      }
    }

    const relativePath = path.join(...pathSegments)

    // Coba di public/uploads terlebih dahulu, kemudian di root uploads
    let filePath = path.join(process.cwd(), 'public', 'uploads', relativePath)
    if (!existsSync(filePath)) {
      filePath = path.join(process.cwd(), 'uploads', relativePath)
    }

    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    const fileBuffer = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase().replace('.', '')
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error serving upload file:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
