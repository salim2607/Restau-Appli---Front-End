import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, UtensilsCrossed, Clock, Award } from "lucide-react"
import { AIImage } from "@/components/AIImage"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}

      <section className="relative flex items-center justify-center h-[70vh] text-center">

      <img
  src="https://i.pinimg.com/736x/2c/36/74/2c3674e8a07ca8fd214854df0491e215.jpg"
  alt="Table italienne élégante"
  width={1600}
  height={800}
  className="h-48 w-full object-cover"
/>

        {/*
        <AIImage
          prompt="Une table italienne élégante avec des pâtes, du vin et une vue sur la campagne toscane"
          alt="Table italienne élégante"
          width={1600}
          height={800}
          className="absolute inset-0 object-cover w-full h-full"
        />
       */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 py-32 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Cuisine Italienne Authentique</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Découvrez le goût de l'Italie dans chaque bouchée. Recettes familiales transmises de génération en
            génération.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/menu">Voir Notre Menu</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-black"
            >
              <Link href="/contact">Réserver une Table</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <UtensilsCrossed className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Cuisine Authentique</h3>
              <p className="text-muted-foreground">
                Nos recettes ont été transmises de génération en génération, apportant les vraies saveurs de l'Italie à
                votre table.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Ingrédients Frais</h3>
              <p className="text-muted-foreground">
                Nous utilisons uniquement les ingrédients les plus frais et de la plus haute qualité pour nos plats,
                garantissant un goût exceptionnel à chaque bouchée.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Récompensé</h3>
              <p className="text-muted-foreground">
                Notre restaurant a été reconnu pour son excellence en cuisine italienne avec de multiples prix
                culinaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Plats Signature</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos plats les plus appréciés qui ont rendu Bella Italia célèbre dans toute la région.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="menu-card bg-card rounded-lg overflow-hidden shadow-md transition-all">
              <AIImage
                prompt="Un plat de spaghetti carbonara authentique italien"
                alt="Spaghetti Carbonara"
                width={600}
                height={400}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Spaghetti Carbonara</h3>
                <p className="text-muted-foreground mb-4">
                  Pâtes romaines classiques avec œufs, fromage, pancetta et poivre noir.
                </p>
                <p className="font-bold text-lg">16,95 €</p>
              </div>
            </div>

            <div className="menu-card bg-card rounded-lg overflow-hidden shadow-md transition-all">
              <AIImage
                prompt="Une pizza margherita napolitaine fraîchement sortie du four"
                alt="Pizza Margherita"
                width={600}
                height={400}
                className="h-48 w-full object-cover"
                
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Pizza Margherita</h3>
                <p className="text-muted-foreground mb-4">
                  Pizza napolitaine traditionnelle avec tomates, mozzarella et basilic.
                </p>
                <p className="font-bold text-lg">14,95 €</p>
              </div>
            </div>

            <div className="menu-card bg-card rounded-lg overflow-hidden shadow-md transition-all">
              <AIImage
                prompt="Un tiramisu italien classique saupoudré de cacao"
                alt="Tiramisu"
                width={600}
                height={400}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Tiramisu</h3>
                <p className="text-muted-foreground mb-4">
                  Biscuits imbibés d'espresso superposés avec de la crème de mascarpone.
                </p>
                <p className="font-bold text-lg">8,95 €</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/menu" className="flex items-center">
                Voir le Menu Complet <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce Que Disent Nos Clients</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ne nous croyez pas sur parole - écoutez nos clients satisfaits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jean Dupont</h4>
                  <p className="text-sm text-muted-foreground">Guide Local</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "La meilleure cuisine italienne que j'ai mangée en dehors de l'Italie. La carbonara est absolument
                authentique et délicieuse !"
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  MS
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Marie Smith</h4>
                  <p className="text-sm text-muted-foreground">Blogueuse Culinaire</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Bella Italia est devenu le restaurant préféré de notre famille. Le personnel est sympathique et la
                nourriture est constamment excellente."
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  RJ
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Johnson</h4>
                  <p className="text-sm text-muted-foreground">Client Régulier</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Le tiramisu ici est à mourir ! Je reviens chaque semaine juste pour ce dessert. Hautement recommandé !"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

