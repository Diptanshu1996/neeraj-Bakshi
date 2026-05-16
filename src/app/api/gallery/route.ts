import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.galleryCategory.findMany({
      include: { links: true },
      orderBy: { category: 'asc' },
    });

    const response = categories.map((category) => ({
      category: category.category,
      imageUrl: category.imageUrl ?? "",
      links: category.links.map((link) => link.url),
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to read gallery data:', error);
    // Keep response shape stable for consumers that always expect an array.
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newEntry = await request.json();
    const categoryName = String(newEntry?.category ?? '').trim();
    const deleteCategory = Boolean(newEntry?.deleteCategory);
    const hasImageUrl = Object.prototype.hasOwnProperty.call(newEntry ?? {}, 'imageUrl');
    const imageUrl = String(newEntry?.imageUrl ?? '').trim();

    if (!categoryName) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    if (deleteCategory) {
      await prisma.galleryCategory.deleteMany({
        where: { category: categoryName },
      });

      return NextResponse.json({ success: true });
    }

    const links = Array.isArray(newEntry?.links)
      ? newEntry.links.map((item: unknown) => String(item ?? '').trim()).filter(Boolean)
      : [];

    const existing = await prisma.galleryCategory.findUnique({
      where: { category: categoryName },
      select: { id: true },
    });

    if (existing) {
      const updateData: {
        imageUrl?: string;
        links: { create: Array<{ url: string }> };
      } = {
        links: {
          create: links.map((url: string) => ({ url })),
        },
      };

      if (hasImageUrl) {
        updateData.imageUrl = imageUrl;
      }

      await prisma.$transaction([
        prisma.galleryLink.deleteMany({ where: { categoryId: existing.id } }),
        prisma.galleryCategory.update({
          where: { id: existing.id },
          data: updateData,
        }),
      ]);
    } else {
      const createData: {
        category: string;
        imageUrl?: string;
        links: { create: Array<{ url: string }> };
      } = {
        category: categoryName,
        links: {
          create: links.map((url: string) => ({ url })),
        },
      };

      if (hasImageUrl) {
        createData.imageUrl = imageUrl;
      }

      await prisma.galleryCategory.create({
        data: createData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update gallery data:', error);
    return NextResponse.json({ error: 'Failed to update gallery data' }, { status: 500 });
  }
}
