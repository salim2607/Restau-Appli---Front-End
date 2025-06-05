"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types pour les utilisateurs
type UserRole = "ROLE_ADMIN" | "ROLE_CUISINIER" | "ROLE_SERVEUR";

interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  createdAt: string;
  active: boolean;
  lastLogin?: string;
}

export default function UsersManagementPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    role: "ROLE_SERVEUR" as UserRole,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Chargement des utilisateurs depuis le backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users");
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de charger les utilisateurs.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.password || !newUser.telephone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: newUser.nom,
          prenom: newUser.prenom,
          email: newUser.email,
          password: newUser.password,
          telephone: newUser.telephone,
          roles: [newUser.role],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de l'utilisateur.");
      }

      // Mise à jour de la liste en relançant la requête
      await fetchUsers();

      // Réinitialiser le formulaire
      setNewUser({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        confirmPassword: "",
        telephone: "",
        role: "ROLE_SERVEUR",
      });

      // Afficher un message de succès
      toast({
        title: "Succès",
        description: `${data.nom} ${data.prenom} a été ajouté avec succès.`,
      });

      // Fermer le popup création APRÈS l'affichage du toast
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer l'utilisateur.",
        variant: "destructive",
      });
    } finally {
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${userToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la suppression.");
      }

      // Mise à jour de la liste après suppression
      await fetchUsers();

      toast({ title: "Supprimé", description: "L'utilisateur a été supprimé." });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      });
    } finally {
      setUserToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.nom} ${u.prenom}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6">
      <Toaster />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des utilisateurs</CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel utilisateur</DialogTitle>
                <DialogDescription>Remplissez les informations</DialogDescription>
              </DialogHeader>
              <form
  onSubmit={(e) => {
    e.preventDefault(); // très important pour éviter le rechargement de la page
    handleCreateUser(e);
    setIsCreateDialogOpen(false);
  }}
  className="space-y-2"
>
                <Input
                  name="nom"
                  placeholder="Nom"
                  onChange={handleInputChange}
                  value={newUser.nom}
                  required
                />
                <Input
                  name="prenom"
                  placeholder="Prénom"
                  onChange={handleInputChange}
                  value={newUser.prenom}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  value={newUser.email}
                  required
                />
                <Input
                  name="telephone"
                  placeholder="Téléphone"
                  onChange={handleInputChange}
                  value={newUser.telephone}
                  required
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                  onChange={handleInputChange}
                  value={newUser.password}
                  required
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmer mot de passe"
                  onChange={handleInputChange}
                  value={newUser.confirmPassword}
                  required
                />
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                    <SelectItem value="ROLE_CUISINIER">Cuisinier</SelectItem>
                    <SelectItem value="ROLE_SERVEUR">Serveur</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <Button type="submit">Créer</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <Input
              placeholder="Recherche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-4 w-4" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.replace("ROLE_", "")}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <Badge>Actif</Badge>
                    ) : (
                      <Badge variant="destructive">Inactif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setUserToDelete(user.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmation suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setUserToDelete(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}