"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"

export async function registerWithCredentials(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password || !name) {
    return { error: "Semua kolom (nama, email, password) harus diisi!" }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: "Email sudah terdaftar!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  // Mengembalikan sinyal sukses ke UI agar bisa menampilkan timer
  return { success: true }
}

export async function loginWithCredentials(formData: FormData, customRedirectTo?: string) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email dan password harus diisi!" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: customRedirectTo || "/dashboard" // Gunakan custom jika ada
    })
  } catch (error: any) {
    // Auth.js redirects by throwing a NEXT_REDIRECT error, so we must re-throw it if it's a redirect
    if (error?.message?.includes("NEXT_REDIRECT") || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }

    if (
      error.type === "CredentialsSignin" ||
      error.name === "CredentialsSignin" ||
      error.code === "credentials" ||
      error?.message?.includes("CredentialsSignin")
    ) {
      return { error: "Email atau kata sandi tidak cocok." }
    }

    console.error("[auth] Login credentials error:", error)
    return { error: "Gagal masuk. Periksa kembali email dan kata sandi Anda." }
  }
}
