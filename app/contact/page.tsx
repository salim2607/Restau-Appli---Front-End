import { AIImage } from "@/components/AIImage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Contactez-nous</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <AIImage
            prompt="Un intérieur chaleureux de restaurant italien"
            alt="Intérieur du restaurant Bella Italia"
            width={600}
            height={400}
            className="rounded-lg shadow-lg mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4">Bella Italia</h2>
          <p className="mb-2">123 Rue des Pâtes, 75001 Paris</p>
          <p className="mb-2">Téléphone : 01 23 45 67 89</p>
          <p className="mb-2">Email : contact@bellaitalia.com</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">Heures d'ouverture :</h3>
          <p>Lundi - Jeudi : 11h00 - 22h00</p>
          <p>Vendredi - Samedi : 11h00 - 23h00</p>
          <p>Dimanche : 12h00 - 21h00</p>
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
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <Textarea id="message" placeholder="Votre message" rows={6} />
            </div>
            <Button type="submit" className="w-full">
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

