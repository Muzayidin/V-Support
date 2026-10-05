import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import EditProfileForm from './EditProfileForm'

export const metadata = {
  title: 'Edit Profil — Cruz',
  description: 'Ubah informasi profil dan nama pengguna di Cruz.',
}

export default async function ProfileEditPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      password: true,
    }
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <EditProfileForm
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        hasPassword: !!user.password,
      }}
    />
  )
}
