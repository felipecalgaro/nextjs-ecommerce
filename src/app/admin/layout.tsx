import { Nav, NavLink } from '@/components/Nav';

export const dynamic = 'force-dynamic' // do not cache admin page, generates dynamic page

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href='/admin'>Dashboard</NavLink>
        <NavLink href='/admin/products'>Products</NavLink>
        <NavLink href='/admin/users'>Customers</NavLink>
        <NavLink href='/admin/orders'>Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  )
}