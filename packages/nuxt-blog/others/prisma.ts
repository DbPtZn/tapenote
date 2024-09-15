import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('prisma', prisma)
})
