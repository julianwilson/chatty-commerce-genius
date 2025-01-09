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
    id: 1,
    title: "Summer Collection",
    active: true,
    products_count: 42,
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    id: 2,
    title: "Winter Essentials",
    active: true,
    products_count: 28,
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: 3,
    title: "Spring Favorites",
    active: false,
    products_count: 35,
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    id: 4,
    title: "Autumn Specials",
    active: true,
    products_count: 31,
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    id: 5,
    title: "Holiday Collection",
    active: true,
    products_count: 56,
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44b",
  },
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
                        <img
                          src={collection.src}
                          alt={collection.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
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