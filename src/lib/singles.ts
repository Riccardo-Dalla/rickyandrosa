import { sql } from "@vercel/postgres";

export interface SinglesProfile {
  id: string;
  name: string;
  age?: number;
  location: string;
  latitude: number;
  longitude: number;
  photo: string;
  description?: string;
  instagram?: string;
  createdAt: string;
}

export async function getProfiles(): Promise<SinglesProfile[]> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      age,
      location,
      latitude,
      longitude,
      photo,
      description,
      instagram,
      created_at AS "createdAt"
    FROM singles_profiles
    ORDER BY created_at DESC
  `;
  return rows as SinglesProfile[];
}

export async function getProfile(id: string): Promise<SinglesProfile | null> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      age,
      location,
      latitude,
      longitude,
      photo,
      description,
      instagram,
      created_at AS "createdAt"
    FROM singles_profiles
    WHERE id = ${id}
    LIMIT 1
  `;
  return (rows[0] as SinglesProfile) || null;
}

export async function addProfile(
  data: Omit<SinglesProfile, "id" | "createdAt">
): Promise<SinglesProfile> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { rows } = await sql`
    INSERT INTO singles_profiles (id, name, age, location, latitude, longitude, photo, description, instagram)
    VALUES (
      ${id},
      ${data.name.trim()},
      ${data.age || null},
      ${data.location.trim()},
      ${data.latitude},
      ${data.longitude},
      ${data.photo},
      ${data.description?.trim() || null},
      ${data.instagram?.trim() || null}
    )
    RETURNING
      id,
      name,
      age,
      location,
      latitude,
      longitude,
      photo,
      description,
      instagram,
      created_at AS "createdAt"
  `;

  return rows[0] as SinglesProfile;
}

export async function updateProfile(
  id: string,
  data: Partial<Omit<SinglesProfile, "id" | "createdAt">>
): Promise<SinglesProfile> {
  const current = await getProfile(id);
  if (!current) throw new Error("Profile not found");

  const updated = {
    name: data.name?.trim() ?? current.name,
    age: data.age ?? current.age,
    location: data.location?.trim() ?? current.location,
    latitude: data.latitude ?? current.latitude,
    longitude: data.longitude ?? current.longitude,
    photo: data.photo ?? current.photo,
    description: data.description?.trim() ?? current.description,
    instagram: data.instagram?.trim() ?? current.instagram,
  };

  const { rows } = await sql`
    UPDATE singles_profiles
    SET
      name = ${updated.name},
      age = ${updated.age},
      location = ${updated.location},
      latitude = ${updated.latitude},
      longitude = ${updated.longitude},
      photo = ${updated.photo},
      description = ${updated.description},
      instagram = ${updated.instagram || null}
    WHERE id = ${id}
    RETURNING
      id,
      name,
      age,
      location,
      latitude,
      longitude,
      photo,
      description,
      instagram,
      created_at AS "createdAt"
  `;

  if (rows.length === 0) throw new Error("Profile not found");
  return rows[0] as SinglesProfile;
}

export async function deleteProfile(id: string): Promise<string | null> {
  const { rows } = await sql`
    DELETE FROM singles_profiles
    WHERE id = ${id}
    RETURNING photo
  `;
  if (rows.length === 0) return null;
  return (rows[0] as { photo: string }).photo;
}
