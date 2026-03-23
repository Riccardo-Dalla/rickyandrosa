import { sql } from "@vercel/postgres";

export interface Commitment {
  id: string;
  name: string;
  email: string;
  activityId: string;
  activityName: string;
  costRange: string;
  message?: string;
  photoUrl?: string;
  isPrivate: boolean;
  completed: boolean;
  createdAt: string;
}

export async function getCommitments(): Promise<Commitment[]> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt"
    FROM commitments
    ORDER BY created_at DESC
  `;
  return rows as Commitment[];
}

export async function addCommitment(
  data: Omit<Commitment, "id" | "completed" | "createdAt">
): Promise<Commitment> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { rows } = await sql`
    INSERT INTO commitments (id, name, email, activity_id, activity_name, cost_range, message, photo_url, is_private)
    VALUES (
      ${id},
      ${data.name},
      ${data.email},
      ${data.activityId},
      ${data.activityName},
      ${data.costRange || "Varies"},
      ${data.message ?? null},
      ${data.photoUrl ?? null},
      ${data.isPrivate ?? false}
    )
    RETURNING
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt"
  `;

  return rows[0] as Commitment;
}

export async function searchCommitments(
  query: string
): Promise<Commitment[]> {
  const q = query.trim();
  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt"
    FROM commitments
    WHERE LOWER(email) = LOWER(${q})
       OR LOWER(name) = LOWER(${q})
    ORDER BY created_at DESC
  `;
  return rows as Commitment[];
}

export async function updateCommitmentPhoto(
  id: string,
  photoUrl: string
): Promise<Commitment> {
  const { rows } = await sql`
    UPDATE commitments
    SET photo_url = ${photoUrl}, completed = true
    WHERE id = ${id}
    RETURNING
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt"
  `;
  if (rows.length === 0) throw new Error("Commitment not found");
  return rows[0] as Commitment;
}

export async function deleteCommitment(id: string): Promise<string | null> {
  const { rows } = await sql`
    DELETE FROM commitments
    WHERE id = ${id}
    RETURNING photo_url AS "photoUrl"
  `;
  if (rows.length === 0) return null;
  return (rows[0] as { photoUrl: string | null }).photoUrl;
}

export async function markCommitmentCompleted(
  id: string
): Promise<Commitment> {
  const { rows } = await sql`
    UPDATE commitments
    SET completed = true
    WHERE id = ${id}
    RETURNING
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt"
  `;
  if (rows.length === 0) throw new Error("Commitment not found");
  return rows[0] as Commitment;
}

export async function getUnremindedCommitments(): Promise<Commitment[]> {
  const { rows } = await sql`
    SELECT
      id,
      name,
      email,
      activity_id   AS "activityId",
      activity_name  AS "activityName",
      cost_range     AS "costRange",
      message,
      photo_url      AS "photoUrl",
      is_private     AS "isPrivate",
      completed,
      created_at     AS "createdAt",
      last_reminded_at AS "lastRemindedAt"
    FROM commitments
    WHERE completed = false
      AND (
        last_reminded_at IS NULL
        OR last_reminded_at < NOW() - INTERVAL '90 days'
      )
    ORDER BY created_at ASC
  `;
  return rows as Commitment[];
}

export async function updateLastReminded(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await sql.query(
    `UPDATE commitments SET last_reminded_at = NOW() WHERE id = ANY($1::text[])`,
    [ids]
  );
}
