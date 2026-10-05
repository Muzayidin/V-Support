import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const ALLOWED_FOLDERS = ['avatars', 'vehicles', 'feedback', 'misc'] as const
type UploadFolder = (typeof ALLOWED_FOLDERS)[number]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folderParam = (formData.get('folder') as string) || 'misc'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Format berkas harus berupa gambar (JPG, PNG, WebP, dll).' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran foto maksimal 10MB.' },
        { status: 400 }
      )
    }

    const folder: UploadFolder = ALLOWED_FOLDERS.includes(folderParam as UploadFolder)
      ? (folderParam as UploadFolder)
      : 'misc'

    // Determine extension
    let ext = 'jpg'
    if (file.type === 'image/png') ext = 'png'
    else if (file.type === 'image/webp') ext = 'webp'
    else if (file.type === 'image/gif') ext = 'gif'
    else if (file.type === 'image/svg+xml') ext = 'svg'
    else if (file.name && file.name.includes('.')) {
      const parts = file.name.split('.')
      const last = parts[parts.length - 1].toLowerCase()
      if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(last)) {
        ext = last
      }
    }

    const randomSuffix = crypto.randomUUID().slice(0, 10)
    const fileName = `${Date.now()}-${randomSuffix}.${ext}`

    // Simpan ke public/uploads dan root uploads agar dapat diakses baik oleh Next.js maupun Nginx standalone
    const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    const rootUploadDir = path.join(process.cwd(), 'uploads', folder)

    await Promise.all([
      fs.mkdir(publicUploadDir, { recursive: true }),
      fs.mkdir(rootUploadDir, { recursive: true })
    ])

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await Promise.all([
      fs.writeFile(path.join(publicUploadDir, fileName), buffer),
      fs.writeFile(path.join(rootUploadDir, fileName), buffer)
    ])

    const publicUrl = `/uploads/${folder}/${fileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah foto.' },
      { status: 500 }
    )
  }
}
