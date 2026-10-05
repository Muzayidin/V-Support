import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ChangePasswordForm from './ChangePasswordForm'

export const metadata = {
  title: 'Ubah Kata Sandi — Cruz',
  description: 'Ubah kata sandi akun Cruz Anda.',
}

export default async function ProfilePasswordPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      password: true,
    }
  })

  if (!user) {
    redirect('/login')
  }

  return <ChangePasswordForm hasPassword={!!user.password} />
}
