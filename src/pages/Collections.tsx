import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const collectionsData = [
  {
    id: 288699203767,
    title: "All",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/all.jpg?v=1685473426",
  },
  {
    id: 288699236535,
    title: "Best Sellers",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/best-sellers.jpg?v=1685473426",
  },
  {
    id: 288699269303,
    title: "Candles",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/candles.jpg?v=1685473426",
  },
  {
    id: 288699302071,
    title: "Diffusers",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/diffusers.jpg?v=1685473426",
  },
  {
    id: 288699334839,
    title: "Fragrance",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/fragrance.jpg?v=1685473426",
  },
  {
    id: 288699367607,
    title: "Gift Sets",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/gift-sets.jpg?v=1685473426",
  },
  {
    id: 288699400375,
    title: "Home",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/home.jpg?v=1685473426",
  },
  {
    id: 288699433143,
    title: "New Arrivals",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/new-arrivals.jpg?v=1685473426",
  },
  {
    id: 288699465911,
    title: "Sale",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0764/8025/4767/collections/sale.jpg?v=1685473426",
  }
];

export default function Collections() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-white">
          <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Collections</h1>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectionsData.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div className="relative w-16 h-16 overflow-hidden rounded-md">
                          <img
                            src={collection.src}
                            alt={collection.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {collection.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={collection.active ? "default" : "secondary"}
                          className={collection.active ? "bg-green-500" : "bg-gray-500"}
                        >
                          {collection.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{collection.products_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}