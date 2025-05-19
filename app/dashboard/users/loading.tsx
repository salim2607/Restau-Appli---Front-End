"use client"; // Ajout de "use client" pour indiquer que ce composant est un Client Component

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium text-gray-600">Chargement...</p>
    </div>
  );
}
