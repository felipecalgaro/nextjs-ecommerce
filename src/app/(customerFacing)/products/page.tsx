import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard';
import { Suspense } from 'react';
import prisma from '@/db/prisma';
import { cache } from '@/lib/cache';

const getProducts = cache(() => {
  return prisma.product.findMany({
    where: {
      isAvailableForPurchase: true
    },
    orderBy: {
      name: 'asc'
    }
  })
}, ['/products', 'getProducts'])

export default function ProductsPage() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Suspense fallback={
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      }>
        <ProductsSuspense />
      </Suspense>
    </div>
  )
}

async function ProductsSuspense() {
  const products = await getProducts()

  return products.map(product => (
    <ProductCard key={product.id} {...product} />
  ))
}