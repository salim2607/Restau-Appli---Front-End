import { AIImage } from "@/components/AIImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ReservationPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Réserver une table</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <AIImage
            prompt="Une table élégamment dressée dans un restaurant italien"
            alt="Table dressée chez Bella Italia"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4">
            Profitez d'une soirée inoubliable
          </h2>
          <p className="mb-4">
            Réservez votre table chez Bella Italia et préparez-vous à vivre une
            expérience culinaire authentique. Notre équipe est impatiente de
            vous accueillir et de vous faire découvrir les saveurs de l'Italie.
          </p>
          <p className="mb-2">
            Pour toute demande spéciale ou pour les groupes de plus de 8
            personnes, veuillez nous contacter directement :
          </p>
          <p className="font-semibold">01 23 45 67 89</p>
        </div>
        <div>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Nom
              </label>
              <Input id="name" placeholder="Votre nom" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="votre@email.com" />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 font-medium">
                Téléphone
              </label>
              <div className="flex">
                <select className="border border-gray-300 rounded-l-lg p-2 bg-gray-100">
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+49">🇩🇪 +49</option>
                </select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Votre numéro"
                  className="rounded-r-lg"
                />
              </div>
            </div>
            <div>
              <label htmlFor="persons" className="block mb-2 font-medium">
                Nombre de personnes
              </label>
              <select
                id="persons"
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
              >
                <option value="">Sélectionnez</option>
                <option value="1">1 personne</option>
                <option value="2">2 personnes</option>
                <option value="3">3 personnes</option>
                <option value="4">4 personnes</option>
                <option value="5">5 personnes</option>
                <option value="6">6 personnes</option>
                <option value="7">7 personnes</option>
                <option value="8">8 personnes</option>
                <option value="plus">Plus de 8 personnes</option>
              </select>
            </div>
            <Button type="submit" className="w-full bg-blue-600 text-white">
              Réserver
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
