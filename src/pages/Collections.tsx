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
    src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/MiniDiffuserLifestyle_16x9_1bec500e-d040-450d-84a8-6a57231486bd.jpg?v=1725958098",
  },
  {
    id: 288699236535,
    title: "Best Sellers",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/EDITION.jpg?v=1657747985",
  },
  {
    id: 288699269303,
    title: "Candles",
    active: true,
    products_count: 0,
    src: "https://cdn.shopify.com/s/files/1/0652/1729/8679/collections/Scentiment_Diffuser_Mini_The_One_Fragrance_Oil.jpg?v=1733336485",
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