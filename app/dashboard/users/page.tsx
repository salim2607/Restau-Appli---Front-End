"use client"

import type React from "react"

import { useState } from "react"
import { Search, Edit, Trash2, UserPlus, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

// Types pour les utilisateurs
type UserRole = "admin" | "staff" | "manager" | "waiter" | "chef"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  active: boolean
  lastLogin?: string
}

export default function UsersManagementPage() {
  const { toast } = useToast()

  // État pour les utilisateurs (simulé)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@bellaitalia.com",
      role: "manager",
      createdAt: "2025-01-15",
      active: true,
      lastLogin: "2025-05-13",
    },
    {
      id: "2",
      name: "Marie Laurent",
      email: "marie.laurent@bellaitalia.com",
      role: "waiter",
      createdAt: "2025-02-20",
      active: true,
      lastLogin: "2025-05-14",
    },
    {
      id: "3",
      name: "Pierre Martin",
      email: "pierre.martin@bellaitalia.com",
      role: "chef",
      createdAt: "2025-03-10",
      active: true,
      lastLogin: "2025-05-10",
    },
    {
      id: "4",
      name: "Sophie Dubois",
      email: "sophie.dubois@bellaitalia.com",
      role: "staff",
      createdAt: "2025-04-05",
      active: false,
      lastLogin: "2025-04-28",
    },
  ])

  // État pour le formulaire de création d'utilisateur
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff" as UserRole,
  })

  // État pour le formulaire de modification d'utilisateur
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "" as UserRole,
    active: true,
  })

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState("")

  // État pour les dialogues
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  // État pour les onglets
  const [activeTab, setActiveTab] = useState("all")

  // Filtrer les utilisateurs en fonction de la recherche et de l'onglet actif
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && user.active
    if (activeTab === "inactive") return matchesSearch && !user.active

    return matchesSearch
  })

  // Gérer les changements dans le formulaire de création
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  // Gérer les changements dans le formulaire de modification
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  // Gérer le changement de rôle
  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value as UserRole }))
  }

  // Gérer le changement de rôle dans le formulaire de modification
  const handleEditRoleChange = (value: string) => {
    setEditForm((prev) => ({ ...prev, role: value as UserRole }))
  }

  // Créer un nouvel utilisateur
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation simple
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      })
      return
    }

    // Vérifier si l'email existe déjà
    if (users.some((user) => user.email === newUser.email)) {
      toast({
        title: "Erreur",
        description: "Cet email est déjà utilisé par un autre compte.",
        variant: "destructive",
      })
      return
    }

    // Simuler la création d'un utilisateur
    const createdUser: User = {
      id: (users.length + 1).toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString().split("T")[0],
      active: true,
    }

    // Ajouter l'utilisateur à la liste
    setUsers((prev) => [...prev, createdUser])

    // Réinitialiser le formulaire
    setNewUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "staff",
    })

    // Fermer le dialogue
    setIsCreateDialogOpen(false)

    // Afficher un message de succès
    toast({
      title: "Utilisateur créé",
      description: `${createdUser.name} a été ajouté avec succès.`,
    })
  }

  // Ouvrir le dialogue de modification
  const handleOpenEditDialog = (user: User) => {
    setEditingUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    })
    setIsEditDialogOpen(true)
  }

  // Modifier un utilisateur
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingUser) return

    // Validation simple
    if (!editForm.name || !editForm.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      })
      return
    }

    // Vérifier si l'email existe déjà (sauf pour l'utilisateur en cours de modification)
    if (users.some((user) => user.email === editForm.email && user.id !== editingUser.id)) {
      toast({
        title: "Erreur",
        description: "Cet email est déjà utilisé par un autre compte.",
        variant: "destructive",
      })
      return
    }

    // Mettre à jour l'utilisateur
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? { ...user, name: editForm.name, email: editForm.email, role: editForm.role, active: editForm.active }
          : user,
      ),
    )

    // Fermer le dialogue
    setIsEditDialogOpen(false)
    setEditingUser(null)

    // Afficher un message de succès
    toast({
      title: "Utilisateur modifié",
      description: `Les informations de ${editForm.name} ont été mises à jour.`,
    })
  }

  // Ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  // Supprimer un utilisateur
  const handleDeleteUser = () => {
    if (!userToDelete) return

    const userToDeleteName = users.find((user) => user.id === userToDelete)?.name

    setUsers((prev) => prev.filter((user) => user.id !== userToDelete))

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)

    toast({
      title: "Utilisateur supprimé",
      description: `${userToDeleteName || "L'utilisateur"} a été supprimé avec succès.`,
    })
  }

  // Basculer le statut actif d'un utilisateur
  const toggleUserStatus = (userId: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))

    const user = users.find((user) => user.id === userId)
    const newStatus = user ? !user.active : false

    toast({
      title: `Statut modifié`,
      description: `L'utilisateur est maintenant ${newStatus ? "actif" : "inactif"}.`,
    })
  }

  // Traduire le rôle en français
  const translateRole = (role: UserRole) => {
    const translations: Record<UserRole, string> = {
      admin: "Administrateur",
      manager: "Manager",
      staff: "Personnel",
      waiter: "Serveur",
      chef: "Chef",
    }
    return translations[role] || role
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-700 hover:bg-red-800">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau compte utilisateur.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="confirmPassword" className="text-right">
                    Confirmer
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Rôle
                  </Label>
                  <Select value={newUser.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="staff">Personnel</SelectItem>
                      <SelectItem value="waiter">Serveur</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Créer l'utilisateur</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="active">Actifs</TabsTrigger>
                  <TabsTrigger value="inactive">Inactifs</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="hidden md:table-cell">Date de création</TableHead>
                <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {translateRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.createdAt}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.lastLogin || "Jamais"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.active ? (
                          <Badge
                            className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            Actif
                          </Badge>
                        ) : (
                          <Badge
                            className="bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                            onClick={() => toggleUserStatus(user.id)}
                          >
                            Inactif
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogue de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>Modifiez les informations de l'utilisateur.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Rôle
                </Label>
                <Select value={editForm.role} onValueChange={handleEditRoleChange}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Personnel</SelectItem>
                    <SelectItem value="waiter">Serveur</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Statut
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={editForm.active ? "default" : "outline"}
                    size="sm"
                    className={editForm.active ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => setEditForm((prev) => ({ ...prev, active: true }))}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Actif
                  </Button>
                  <Button
                    type="button"
                    variant={!editForm.active ? "default" : "outline"}
                    size="sm"
                    className={!editForm.active ? "bg-gray-600 hover:bg-gray-700" : ""}
                    onClick={() => setEditForm((prev) => ({ ...prev, active: false }))}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Inactif
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le compte utilisateur et toutes les
              données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}
