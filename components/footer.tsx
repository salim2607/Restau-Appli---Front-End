import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Bella Italia</h3>
            <p className="text-sm text-muted-foreground">
              Cuisine italienne authentique préparée avec amour et tradition depuis 1985.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Horaires</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Lundi - Jeudi: 11h - 22h</li>
              <li>Vendredi - Samedi: 11h - 23h</li>
              <li>Dimanche: 12h - 21h</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Rue des Pâtes</li>
              <li>Quartier Italien</li>
              <li>Téléphone: (123) 456-7890</li>
              <li>Email: info@bellaitalia.com</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold">Suivez-nous</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bella Italia. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

