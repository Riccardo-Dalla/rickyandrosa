import { sql } from "@vercel/postgres";

export interface Guest {
  id: string;
  name: string;
  email: string;
  address: string;
  createdAt: string;
}

export async function findGuestByEmail(email: string): Promise<Guest | null> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      address,
      created_at AS "createdAt"
    FROM guests
    WHERE LOWER(email) = LOWER(${email.trim()})
    LIMIT 1
  `;
  return (rows[0] as Guest) || null;
}

export async function addGuest(
  data: Omit<Guest, "id" | "createdAt">
): Promise<Guest> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { rows } = await sql`
    INSERT INTO guests (id, name, email, address)
    VALUES (
      ${id},
      ${data.name.trim()},
      ${data.email.trim().toLowerCase()},
      ${data.address.trim()}
    )
    RETURNING
      id,
      name,
      email,
      address,
      created_at AS "createdAt"
  `;

  return rows[0] as Guest;
}

export async function getGuests(): Promise<Guest[]> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      address,
      created_at AS "createdAt"
    FROM guests
    ORDER BY created_at DESC
  `;
  return rows as Guest[];
}
