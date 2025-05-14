"use client"

import { useState } from "react"
import { MoreVertical, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Types pour les commandes
type OrderStatus = "new" | "on_cook" | "completed" | "cancelled"
type OrderType = "dine_in" | "takeaway"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  tableNumber?: string
  items: OrderItem[]
  totalItems: number
  totalPrice: number
  status: OrderStatus
  notes?: string
  type: OrderType
  createdAt: string
}

// Fonction pour formater le prix
const formatPrice = (price: number) => {
  return `${price.toFixed(2)}$`
}

// Fonction pour traduire le statut
const translateStatus = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string; className: string }> = {
    new: { label: "New Order", className: "bg-blue-100 text-blue-800" },
    on_cook: { label: "On Cook", className: "bg-orange-100 text-orange-800" },
    completed: { label: "Complete", className: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  }
  return statusMap[status]
}

export default function OrdersPage() {
  const { toast } = useToast()
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  // État pour les commandes (simulé)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "0045",
      tableNumber: "16",
      items: [
        { id: "1", name: "Margherita Pizza", quantity: 2, price: 12.99 },
        { id: "2", name: "Extra cheese", quantity: 1, price: 2.5 },
      ],
      totalItems: 7,
      totalPrice: 166.99,
      status: "new",
      notes: "Extra cheese sur la margherita",
      type: "dine_in",
      createdAt: "2025-06-10",
    },
    {
      id: "2",
      orderNumber: "0056",
      tableNumber: "09",
      items: [
        { id: "3", name: "Carbonara", quantity: 1, price: 14.99 },
        { id: "4", name: "Tiramisu", quantity: 1, price: 6.99 },
      ],
      totalItems: 4,
      totalPrice: 52.99,
      status: "cancelled",
      type: "dine_in",
      createdAt: "2025-06-10",
    },
    {
      id: "3",
      orderNumber: "0049",
      tableNumber: "24",
      items: [{ id: "5", name: "Veggie Supreme", quantity: 1, price: 15.99 }],
      totalItems: 2,
      totalPrice: 30,
      status: "on_cook",
      notes: "peanuts allergies",
      type: "dine_in",
      createdAt: "2025-06-10",
    },
    {
      id: "4",
      orderNumber: "0945",
      tableNumber: "26",
      items: [
        { id: "6", name: "Veggie Supreme", quantity: 2, price: 24.99 },
        { id: "7", name: "Margherita (16 inch)", quantity: 1, price: 29.0 },
        { id: "8", name: "BBQ Chicken", quantity: 2, price: 32.99 },
        { id: "9", name: "California Pizza", quantity: 2, price: 19.99 },
      ],
      totalItems: 7,
      totalPrice: 102,
      status: "completed",
      type: "dine_in",
      createdAt: "2025-06-10",
    },
    {
      id: "5",
      orderNumber: "0046",
      items: [
        { id: "10", name: "Margherita Pizza", quantity: 2, price: 12.99 },
        { id: "11", name: "Extra cheese", quantity: 1, price: 2.5 },
      ],
      totalItems: 7,
      totalPrice: 166.99,
      status: "new",
      notes: "Extra cheese sur la margherita",
      type: "takeaway",
      createdAt: "2025-06-10",
    },
  ])

  // État pour le filtre de statut actif
  const [activeStatusFilter, setActiveStatusFilter] = useState<"all" | OrderStatus>("all")

  // État pour le type de commande actif (sur place ou à emporter)
  const [activeOrderType, setActiveOrderType] = useState<OrderType>("dine_in")

  // État pour la commande sélectionnée
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // État pour le dialogue de détails de commande
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

  // Filtrer les commandes en fonction du type et du statut
  const filteredOrders = orders.filter((order) => {
    if (order.type !== activeOrderType) return false
    if (activeStatusFilter === "all") return true
    return order.status === activeStatusFilter
  })

  // Ouvrir le dialogue de détails de commande
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  // Changer le statut d'une commande
  const handleChangeStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    toast({
      title: "Statut mis à jour",
      description: `La commande #${orders.find((o) => o.id === orderId)?.orderNumber} est maintenant ${translateStatus(newStatus).label}`,
    })
  }

  // Supprimer une commande
  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      const orderToDelete = orders.find((o) => o.id === orderId)
      setOrders((prev) => prev.filter((order) => order.id !== orderId))

      toast({
        title: "Commande supprimée",
        description: `La commande #${orderToDelete?.orderNumber} a été supprimée avec succès.`,
      })
    }
  }

  // Calculer le sous-total, la taxe et le total pour une commande
  const calculateOrderTotals = (order: Order) => {
    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.25 // 25% de taxe (exemple)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="dine_in" onValueChange={(value) => setActiveOrderType(value as OrderType)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {activeOrderType === "dine_in" ? "Order List" : "TakeAway Orders"}
            </h1>
            <p className="text-gray-500">{today}</p>
          </div>
          <TabsList className="mt-4 md:mt-0">
            <TabsTrigger value="dine_in">Order List</TabsTrigger>
            <TabsTrigger value="takeaway">TakeAway Orders</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dine_in" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Commandes sur place</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={activeStatusFilter === "all" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("all")}
                    className="relative"
                  >
                    All
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "dine_in").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "new" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("new")}
                    className="relative"
                  >
                    New Orders
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "dine_in" && o.status === "new").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "on_cook" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("on_cook")}
                    className="relative"
                  >
                    On Cook
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "dine_in" && o.status === "on_cook").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("completed")}
                    className="relative"
                  >
                    Completed
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "dine_in" && o.status === "completed").length}
                    </span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Order Line</TableHead>
                    <TableHead className="w-[300px]">Notes</TableHead>
                    <TableHead>Number of items</TableHead>
                    <TableHead>Total price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOpenOrderDetails(order)}
                      >
                        <TableCell>
                          <div className="bg-gray-100 p-2 rounded inline-block">
                            <div className="font-medium">Table {order.tableNumber}</div>
                            <div className="text-xs text-gray-500">Order #{order.orderNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.notes || "-"}</TableCell>
                        <TableCell>{order.totalItems}</TableCell>
                        <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell>
                          <Badge className={translateStatus(order.status).className}>
                            {translateStatus(order.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "new")
                                }}
                              >
                                Marquer comme Nouvelle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "on_cook")
                                }}
                              >
                                Marquer comme En Cuisine
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "completed")
                                }}
                              >
                                Marquer comme Terminée
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "cancelled")
                                }}
                              >
                                Marquer comme Annulée
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteOrder(order.id)
                                }}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucune commande trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="takeaway" className="space-y-4">
          <Card>
            <CardHeader className="bg-gray-50 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Commandes à emporter</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={activeStatusFilter === "all" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("all")}
                    className="relative"
                  >
                    All
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "takeaway").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "new" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("new")}
                    className="relative"
                  >
                    New Orders
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "takeaway" && o.status === "new").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "on_cook" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("on_cook")}
                    className="relative"
                  >
                    On Cook
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "takeaway" && o.status === "on_cook").length}
                    </span>
                  </Button>
                  <Button
                    variant={activeStatusFilter === "completed" ? "default" : "outline"}
                    onClick={() => setActiveStatusFilter("completed")}
                    className="relative"
                  >
                    Completed
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                      {orders.filter((o) => o.type === "takeaway" && o.status === "completed").length}
                    </span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Order Line</TableHead>
                    <TableHead className="w-[300px]">Notes</TableHead>
                    <TableHead>Number of items</TableHead>
                    <TableHead>Total price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleOpenOrderDetails(order)}
                      >
                        <TableCell>
                          <div className="bg-gray-100 p-2 rounded inline-block">
                            <div className="font-medium">
                              <ShoppingBag className="h-4 w-4 inline-block mr-1" />
                              Takeaway
                            </div>
                            <div className="text-xs text-gray-500">Order #{order.orderNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.notes || "-"}</TableCell>
                        <TableCell>{order.totalItems}</TableCell>
                        <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                        <TableCell>
                          <Badge className={translateStatus(order.status).className}>
                            {translateStatus(order.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "new")
                                }}
                              >
                                Marquer comme Nouvelle
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "on_cook")
                                }}
                              >
                                Marquer comme En Cuisine
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "completed")
                                }}
                              >
                                Marquer comme Terminée
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeStatus(order.id, "cancelled")
                                }}
                              >
                                Marquer comme Annulée
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteOrder(order.id)
                                }}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucune commande trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue de détails de commande */}
      {selectedOrder && (
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>
                  {selectedOrder.type === "dine_in" ? `Table No #${selectedOrder.tableNumber}` : "Commande à emporter"}
                </span>
                <Button variant="outline" size="icon" onClick={() => setIsOrderDetailsOpen(false)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </DialogTitle>
              <DialogDescription>Order #{selectedOrder.orderNumber}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ordered Items ({selectedOrder.items.length})</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateOrderTotals(selectedOrder).subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${calculateOrderTotals(selectedOrder).tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Donation for disable people</span>
                    <span>$5.99</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateOrderTotals(selectedOrder).total.toFixed(2)}</span>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChangeStatus(selectedOrder.id, "new")
                    setIsOrderDetailsOpen(false)
                  }}
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  New
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChangeStatus(selectedOrder.id, "on_cook")
                    setIsOrderDetailsOpen(false)
                  }}
                  className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                >
                  On Cook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChangeStatus(selectedOrder.id, "completed")
                    setIsOrderDetailsOpen(false)
                  }}
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleChangeStatus(selectedOrder.id, "cancelled")
                    setIsOrderDetailsOpen(false)
                  }}
                  className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
