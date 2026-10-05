'use server'

import prisma from '@/lib/prisma'

export interface SubmitFeedbackInput {
  name?: string
  email?: string
  category: string
  message: string
  imageUrl?: string
  rating?: number
}

export async function submitFeedback(input: SubmitFeedbackInput) {
  if (!input.message || !input.message.trim()) {
    return { success: false, error: 'Pesan kritik atau saran tidak boleh kosong.' }
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        name: input.name?.trim() || null,
        email: input.email?.trim() || null,
        category: input.category || 'SUGGESTION',
        message: input.message.trim(),
        imageUrl: input.imageUrl?.trim() || null,
        rating: input.rating || 5,
      }
    })

    return { success: true, id: feedback.id }
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    return { success: false, error: 'Terjadi kesalahan sistem saat mengirim kritik dan saran.' }
  }
}
