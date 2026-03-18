import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export interface Commitment {
  id: string;
  name: string;
  email: string;
  activityId: string;
  activityName: string;
  costRange: string;
  message?: string;
  photoUrl?: string;
  completed: boolean;
  createdAt: string;
}

const DATA_PATH = join(process.cwd(), "data", "commitments.json");

export async function getCommitments(): Promise<Commitment[]> {
  try {
    const raw = await readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function addCommitment(
  data: Omit<Commitment, "id" | "completed" | "createdAt">
): Promise<Commitment> {
  const commitments = await getCommitments();
  const commitment: Commitment = {
    ...data,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  commitments.unshift(commitment);
  await writeFile(DATA_PATH, JSON.stringify(commitments, null, 2));
  return commitment;
}
