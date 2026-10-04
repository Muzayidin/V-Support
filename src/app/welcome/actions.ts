"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Updated schema fields: brakePadConditionRear, coolantCondition, oilCondition
export interface OnboardingData {
  vehicleType: "MOTORCYCLE" | "CAR"
  engineType: "ICE" | "EV"
  name: string
  licensePlate: string
  transmission: "AUTOMATIC" | "MANUAL"
  ccOrKwh: number | null
  currentMileage: number
  
  // Riwayat Servis (opsional / bisa dilewati)
  hasServiceHistory: boolean
  lastServiceDate?: string | null
  lastServiceMileage?: number | null
  lastServiceCost?: number | null
  serviceComponents?: string[]
  
  // Kondisi Komponen Fisik (default 50%)
  tireConditionFront: number
  tireConditionRear: number
  brakePadCondition: number
  brakePadConditionRear: number
  coolantCondition: number
  oilCondition: number
}

export async function submitVehicleOnboarding(data: OnboardingData) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali." }
    }
    const userId = session.user.id

    if (!data.name?.trim()) {
      return { success: false, error: "Nama kendaraan wajib diisi." }
    }

    const vehicleType = data.vehicleType === "CAR" ? "CAR" : "MOTORCYCLE"
    const currentMileage = Number(data.currentMileage) || 0
    const engineType = data.engineType === "EV" ? "EV" : "ICE"
    const transmission = engineType === "EV" ? "AUTOMATIC" : (data.transmission || "AUTOMATIC")

    let lastOilChange: Date | null = null
    let lastService: Date | null = null

    if (data.hasServiceHistory && data.lastServiceDate) {
      lastService = new Date(data.lastServiceDate)
      const hasOilInHistory = data.serviceComponents?.some(c => 
        c.toLowerCase().includes("oli mesin") || c.toLowerCase().includes("oli")
      )
      if (engineType === "ICE" && (hasOilInHistory || (data.serviceComponents?.length ?? 0) === 0)) {
        lastOilChange = lastService
      }
    }

    // Default 50% untuk semua kondisi jika tidak terdefinisi
    const tireConditionFront = typeof data.tireConditionFront === "number" ? data.tireConditionFront : 50
    const tireConditionRear = typeof data.tireConditionRear === "number" ? data.tireConditionRear : 50
    const brakePadCondition = typeof data.brakePadCondition === "number" ? data.brakePadCondition : 50
    const brakePadConditionRear = typeof data.brakePadConditionRear === "number" ? data.brakePadConditionRear : 50
    const coolantCondition = typeof data.coolantCondition === "number" ? data.coolantCondition : 50
    const oilCondition = typeof data.oilCondition === "number" ? data.oilCondition : 50

    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat kendaraan baru
      const vehicle = await tx.vehicle.create({
        data: {
          userId,
          name: data.name.trim(),
          licensePlate: data.licensePlate?.trim() || null,
          vehicleType,
          engineType,
          transmission,
          ccOrKwh: data.ccOrKwh ? Number(data.ccOrKwh) : null,
          currentMileage,
          swdklljAmount: vehicleType === "CAR" ? 143000 : 35000,
          lastOilChange,
          lastService,
          tireConditionFront,
          tireConditionRear,
          brakePadCondition,
          brakePadConditionRear,
          coolantCondition,
          oilCondition,
        }
      })

      // 2. Jika user memasukkan riwayat servis, buat ServiceRecord & ServiceDetail
      if (data.hasServiceHistory && data.lastServiceDate) {
        const recordDate = new Date(data.lastServiceDate)
        const recordMileage = data.lastServiceMileage ? Number(data.lastServiceMileage) : currentMileage
        const totalCost = data.lastServiceCost ? Math.max(0, Number(data.lastServiceCost)) : 0
        const components = (data.serviceComponents && data.serviceComponents.length > 0)
          ? data.serviceComponents
          : ["Servis Berkala Terakhir"]

        const costPerItem = components.length > 0 ? Math.round(totalCost / components.length) : totalCost

        await tx.serviceRecord.create({
          data: {
            vehicleId: vehicle.id,
            date: recordDate,
            mileage: recordMileage,
            totalCost,
            details: {
              create: components.map(compName => ({
                componentName: compName,
                cost: costPerItem
              }))
            }
          }
        })
      }

      return vehicle
    })

    revalidatePath("/")
    revalidatePath("/vehicles")
    revalidatePath("/history")

    return { success: true, vehicleId: result.id }
  } catch (error) {
    console.error("Error creating vehicle onboarding:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan data kendaraan." 
    }
  }
}

export async function resetUserVehiclesForTesting() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const userId = session.user.id

    // Dapatkan semua kendaraan milik user saat ini
    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      select: { id: true }
    })

    const vehicleIds = vehicles.map(v => v.id)

    if (vehicleIds.length > 0) {
      await prisma.$transaction(async (tx) => {
        // Hapus detail servis
        await tx.serviceDetail.deleteMany({
          where: {
            serviceRecord: {
              vehicleId: { in: vehicleIds }
            }
          }
        })

        // Hapus record servis
        await tx.serviceRecord.deleteMany({
          where: {
            vehicleId: { in: vehicleIds }
          }
        })

        // Hapus kendaraan
        await tx.vehicle.deleteMany({
          where: {
            id: { in: vehicleIds }
          }
        })
      })
    }

    revalidatePath("/welcome")
    revalidatePath("/vehicles")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error resetting vehicles:", error)
    return { success: false, error: "Gagal menghapus data kendaraan uji coba." }
  }
}

