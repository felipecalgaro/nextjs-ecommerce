import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/db/prisma';
import { formatCurrency, formatNumber } from '@/lib/formatters';

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  }
}

async function getUsersData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaidInCents: true },
    })
  ])

  return {
    userCount,
    averageValuePerUser: userCount !== 0
      ? (orderData._sum.pricePaidInCents || 0) / userCount / 100
      : 0
  }
}

async function getProductsData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return {
    activeCount,
    inactiveCount
  }
}

export default async function AdminDashboard() {
  const [salesData, usersData, productsData] = await Promise.all([
    getSalesData(),
    getUsersData(),
    getProductsData()
  ])


  return <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
    <DashboardCard
      title='Sales'
      subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
      body={formatCurrency(salesData.amount)}
    />
    <DashboardCard
      title='Customers'
      subtitle={`${formatCurrency(usersData.averageValuePerUser)} Average Value`}
      body={formatNumber(usersData.userCount)}
    />
    <DashboardCard
      title='Active Products'
      subtitle={`${formatCurrency(productsData.inactiveCount)} Inactive`}
      body={formatNumber(productsData.activeCount)}
    />
  </div>
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}