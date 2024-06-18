import prisma from './prisma-client'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('prisma', prisma)
})
