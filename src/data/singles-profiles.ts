export interface SinglesProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  coordinates: [number, number]; // [latitude, longitude]
  photo: string;
  description: string;
  instagram?: string;
}

// Add your single guests here!
// Photos go in public/singles/ (e.g. public/singles/marco.jpg → "/singles/marco.jpg")
export const profiles: SinglesProfile[] = [
  {
    id: "1",
    name: "Max",
    age: 36,
    location: "Boston",
    coordinates: [42.3601, -71.0589],
    photo: "/singles/max.jpg",
    description:
      "Engineer and Ricky's coworker. When he's not shipping code, you'll find him sailing.",
    instagram: "max_instagram",
  },
  {
    id: "2",
    name: "Kiley",
    age: 30,
    location: "Los Angeles",
    coordinates: [34.0522, -118.2437],
    photo: "/singles/kiley.jpg",
    description:
      "Writer, traveler, and Rosa's friend from Stanford. Always planning the next adventure.",
    instagram: "kiley_instagram",
  },
  {
    id: "3",
    name: "Andrea",
    age: 29,
    location: "Bologna",
    coordinates: [44.4949, 11.3426],
    photo: "/singles/andrea.jpg",
    description:
      "Engineer and Ricky's childhood friend. Bologna born and raised.",
    instagram: "andrea_instagram",
  },
  {
    id: "4",
    name: "Irene",
    age: 29,
    location: "Bologna",
    coordinates: [44.4949, 11.3426],
    photo: "/singles/irene.jpg",
    description:
      "Ricky's childhood friend and neighbor — they went to school together. Physical therapist.",
    instagram: "irene_instagram",
  },
];
