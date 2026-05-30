import prisma from "../lib/prisma.js";
import { DEMO_USER } from "../constants/demo-user.js";

export type PotResponse = {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
};

export type UpsertPotInput = {
  name: string;
  target: number;
  total?: number;
  theme: string;
};

export class PotNotFoundError extends Error {
  constructor(potId: number) {
    super(`Pot ${potId} not found.`);
    this.name = "PotNotFoundError";
  }
}

const toPotResponse = (pot: {
  id: number;
  name: string;
  target: number;
  total: number;
  theme: string;
}): PotResponse => ({
  id: String(pot.id),
  name: pot.name,
  target: pot.target,
  total: pot.total,
  theme: pot.theme,
});

const getDemoUser = async () =>
  prisma.user.findUnique({
    where: { email: DEMO_USER.email },
  });

const getOwnedPot = async (potId: number) => {
  const user = await getDemoUser();

  if (!user) {
    throw new PotNotFoundError(potId);
  }

  const pot = await prisma.pot.findFirst({
    where: {
      id: potId,
      userId: user.id,
    },
  });

  if (!pot) {
    throw new PotNotFoundError(potId);
  }

  return { pot, user };
};

export const listPots = async (): Promise<PotResponse[]> => {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
    include: { pots: true },
  });

  if (!user) {
    return [];
  }

  return user.pots.map(toPotResponse);
};

export const createPot = async (input: UpsertPotInput): Promise<PotResponse> => {
  const user = await getDemoUser();

  if (!user) {
    throw new Error("Demo user not found.");
  }

  const pot = await prisma.pot.create({
    data: {
      userId: user.id,
      name: input.name,
      target: input.target,
      total: input.total ?? 0,
      theme: input.theme,
    },
  });

  return toPotResponse(pot);
};

export const updatePot = async (
  potId: number,
  input: UpsertPotInput,
): Promise<PotResponse> => {
  const { pot: currentPot } = await getOwnedPot(potId);

  const pot = await prisma.pot.update({
    where: { id: potId },
    data: {
      name: input.name,
      target: input.target,
      total: input.total ?? currentPot.total,
      theme: input.theme,
    },
  });

  return toPotResponse(pot);
};

export const updatePotBalance = async (
  potId: number,
  amountDelta: number,
): Promise<PotResponse> => {
  const { pot: currentPot } = await getOwnedPot(potId);
  const total = Math.max(
    0,
    Math.min(currentPot.target, currentPot.total + amountDelta),
  );

  const pot = await prisma.pot.update({
    where: { id: potId },
    data: { total },
  });

  return toPotResponse(pot);
};

export const deletePot = async (potId: number): Promise<{ success: true }> => {
  await getOwnedPot(potId);

  await prisma.pot.delete({
    where: { id: potId },
  });

  return { success: true };
};
