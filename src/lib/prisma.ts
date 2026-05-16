import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// In dev, schema updates can leave a stale cached client without newer model delegates.
const cachedClient = globalForPrisma.prisma;
const hasPerformanceHighlights = Boolean((cachedClient as PrismaClient & { performanceHighlight?: unknown })?.performanceHighlight);
const hasTestimonials = Boolean((cachedClient as PrismaClient & { testimonial?: unknown })?.testimonial);
const hasPhotoGallery = Boolean((cachedClient as PrismaClient & { photoGalleryImage?: unknown })?.photoGalleryImage);

export const prisma = !cachedClient || !hasPerformanceHighlights || !hasTestimonials || !hasPhotoGallery ? createPrismaClient() : cachedClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
