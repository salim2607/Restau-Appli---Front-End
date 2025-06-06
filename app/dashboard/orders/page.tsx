"use client"

import { useState, useEffect } from "react"
import { MoreVertical, Trash2, ShoppingBag, Download } from "lucide-react"
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

// Types pour les commandes basés sur votre API
type OrderStatus = "à cuisiner" | "en préparation" | "prête" | "annulée"
type PaymentStatus = "a payée" | "en attente" | "refusée"

interface OrderItem {
  id: number
  quantite: number
  menu: null | {
    id: number
    nom: string
    prix: number
    imageUrl: string
  }
  plat: null | {
    id: number
    nom: string
    description: string | null
    prix: number
    imageUrl: string
  }
  boisson: null | {
    id: number
    nom: string
    prix: number
    imageUrl: string
  }
  dessert: null | {
    id: number
    nom: string
    prix: number
    imageUrl: string
  }
}

interface Order {
  id: number
  statutPreparation: OrderStatus
  statutPaiement: PaymentStatus
  lignesCommande: OrderItem[]
}

// Fonction pour formater le prix
const formatPrice = (price: number) => {
  return `${price.toFixed(2)}€`
}

// Fonction pour calculer le total d'une commande
const calculateOrderTotal = (order: Order) => {
  return order.lignesCommande.reduce((total, item) => {
    if (item.plat) return total + (item.plat.prix * item.quantite)
    if (item.menu) return total + (item.menu.prix * item.quantite)
    if (item.boisson) return total + (item.boisson.prix * item.quantite)
    if (item.dessert) return total + (item.dessert.prix * item.quantite)
    return total
  }, 0)
}

// Fonction pour traduire le statut
const translateStatus = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string; className: string }> = {
    "à cuisiner": { label: "À cuisiner", className: "bg-blue-100 text-blue-800" },
    "en préparation": { label: "En préparation", className: "bg-orange-100 text-orange-800" },
    "prête": { label: "Prête", className: "bg-green-100 text-green-800" },
    "annulée": { label: "Annulée", className: "bg-red-100 text-red-800" },
  }
  return statusMap[status]
}

export default function OrdersPage() {
  const { toast } = useToast()
  const today = new Date().toLocaleDateString("fr-FR", { month: "long", day: "numeric", year: "numeric" })

  // État pour les commandes
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les commandes depuis l'API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/commandes")
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des commandes")
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les commandes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  // État pour le filtre de statut actif
  const [activeStatusFilter, setActiveStatusFilter] = useState<"all" | OrderStatus>("all")

  // État pour la commande sélectionnée
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // État pour le dialogue de détails de commande
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

  // Filtrer les commandes en fonction du statut
  const filteredOrders = orders.filter((order) => {
    if (activeStatusFilter === "all") return true
    return order.statutPreparation === activeStatusFilter
  })

  // Ouvrir le dialogue de détails de commande
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailsOpen(true)
  }

  // Télécharger la facture au format PDF
  const handleDownloadInvoice = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/paiement/facture/${orderId}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement de la facture.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `facture-${orderId}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Facture téléchargée",
        description: `La facture pour la commande #${orderId} a été téléchargée avec succès.`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture.",
        variant: "destructive",
      })
    }
  }

  // Changer le statut d'une commande
  const handleChangeStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/commandes/${orderId}/preparation`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statutPreparation: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut.");
      }

      // Mettre à jour localement le statut de la commande
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, statutPreparation: newStatus } : order
        )
      );

      toast({
        title: "Statut mis à jour",
        description: `La commande #${orderId} est maintenant ${translateStatus(newStatus).label}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    }
  };

  // Supprimer une commande
  const handleDeleteOrder = async (orderId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      try {
        // Ici vous devriez faire une requête DELETE vers votre API
        // Pour l'exemple, nous supprimons localement
        setOrders((prev) => prev.filter((order) => order.id !== orderId))

        toast({
          title: "Commande supprimée",
          description: `La commande #${orderId} a été supprimée avec succès.`,
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la commande",
          variant: "destructive",
        })
      }
    }
  }

  // Calculer le nombre total d'articles dans une commande
  const calculateTotalItems = (order: Order) => {
    return order.lignesCommande.reduce((total, item) => total + item.quantite, 0)
  }

  // Obtenir le nom d'un article
  const getItemName = (item: OrderItem) => {
    if (item.plat) return item.plat.nom
    if (item.menu) return item.menu.nom
    if (item.boisson) return item.boisson.nom
    if (item.dessert) return item.dessert.nom
    return "Article inconnu"
  }

  // Obtenir le prix d'un article
  const getItemPrice = (item: OrderItem) => {
    if (item.plat) return item.plat.prix
    if (item.menu) return item.menu.prix
    if (item.boisson) return item.boisson.prix
    if (item.dessert) return item.dessert.prix
    return 0
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <p>Chargement des commandes...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Liste des commandes</h1>
          <p className="text-gray-500">{today}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Commandes en cours</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={activeStatusFilter === "all" ? "default" : "outline"}
                onClick={() => setActiveStatusFilter("all")}
                className="relative"
              >
                Toutes
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {orders.length}
                </span>
              </Button>
              <Button
                variant={activeStatusFilter === "à cuisiner" ? "default" : "outline"}
                onClick={() => setActiveStatusFilter("à cuisiner")}
                className="relative"
              >
                À cuisiner
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {orders.filter((o) => o.statutPreparation === "à cuisiner").length}
                </span>
              </Button>
              <Button
                variant={activeStatusFilter === "en préparation" ? "default" : "outline"}
                onClick={() => setActiveStatusFilter("en préparation")}
                className="relative"
              >
                En préparation
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {orders.filter((o) => o.statutPreparation === "en préparation").length}
                </span>
              </Button>
              <Button
                variant={activeStatusFilter === "prête" ? "default" : "outline"}
                onClick={() => setActiveStatusFilter("prête")}
                className="relative"
              >
                Prêtes
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                  {orders.filter((o) => o.statutPreparation === "prête").length}
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[300px]">Articles</TableHead>
                <TableHead>Nombre d'articles</TableHead>
                <TableHead>Prix total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
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
                      <div className="font-medium">#{order.id}</div>
                    </TableCell>
                    <TableCell>
                      {order.lignesCommande.slice(0, 2).map((item) => (
                        <div key={item.id}>
                          {item.quantite}x {getItemName(item)}
                        </div>
                      ))}
                      {order.lignesCommande.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{order.lignesCommande.length - 2} autres articles
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{calculateTotalItems(order)}</TableCell>
                    <TableCell>{formatPrice(calculateOrderTotal(order))}</TableCell>
                    <TableCell>
                      <Badge className={translateStatus(order.statutPreparation).className}>
                        {translateStatus(order.statutPreparation).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        order.statutPaiement === "a payée" 
                          ? "bg-green-100 text-green-800" 
                          : order.statutPaiement === "en attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }>
                        {order.statutPaiement}
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
                              handleChangeStatus(order.id, "à cuisiner")
                            }}
                          >
                            Marquer comme À cuisiner
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChangeStatus(order.id, "en préparation")
                            }}
                          >
                            Marquer comme En préparation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChangeStatus(order.id, "prête")
                            }}
                          >
                            Marquer comme Prête
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChangeStatus(order.id, "annulée")
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
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucune commande trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue de détails de commande */}
      {selectedOrder && (
        <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center text-lg font-bold text-gray-800">
                <span>Commande #{selectedOrder.id}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsOrderDetailsOpen(false)}
                  className="hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Statut: <Badge className={translateStatus(selectedOrder.statutPreparation).className}>
                  {translateStatus(selectedOrder.statutPreparation).label}
                </Badge>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Articles commandés */}
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-3">Articles commandés ({selectedOrder.lignesCommande.length})</h3>
                <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                  {selectedOrder.lignesCommande.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                      <span>
                        {item.quantite}x {getItemName(item)}
                      </span>
                      <span className="font-medium">{getItemPrice(item) * item.quantite}€</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Récapitulatif */}
              <div>
                <h3 className="text-base font-semibold text-gray-700 mb-3">Récapitulatif</h3>
                <div className="space-y-2 border rounded-md p-4 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Total articles</span>
                    <span className="font-medium">{calculateOrderTotal(selectedOrder)}€</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "à cuisiner");
                      setIsOrderDetailsOpen(false);
                    }}
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    À cuisiner
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "en préparation");
                      setIsOrderDetailsOpen(false);
                    }}
                    className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                  >
                    En préparation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "prête");
                      setIsOrderDetailsOpen(false);
                    }}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  >
                    Prête
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleChangeStatus(selectedOrder.id, "annulée");
                      setIsOrderDetailsOpen(false);
                    }}
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  >
                    Annuler
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadInvoice(selectedOrder.id)}
                  className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la facture
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch(`http://localhost:8080/api/paiement/carte?commandeId=${selectedOrder.id}`, {
                        method: "POST", // Changement de PUT à POST
                        headers: {
                          "Content-Type": "application/json",
                        },
                      });

                      console.log(await response.text()); // Affiche la réponse brute

                      if (!response.ok) {
                        throw new Error("Erreur lors de la mise à jour du statut de paiement.");
                      }

                      // Mettre à jour localement le statut de paiement
                      setOrders((prev) =>
                        prev.map((order) =>
                          order.id === selectedOrder.id ? { ...order, statutPaiement: "a payée" } : order
                        )
                      );

                      toast({
                        title: "Statut de paiement mis à jour",
                        description: `La commande #${selectedOrder.id} est maintenant marquée comme payée.`,
                      });

                      setIsOrderDetailsOpen(false);
                    } catch (error) {
                      toast({
                        title: "Erreur",
                        description: "Impossible de mettre à jour le statut de paiement.",
                        variant: "destructive",
                      });
                    }
                  }}
                  className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                >
                  Marquer comme payée
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}