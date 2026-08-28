import "server-only";
import { prisma } from "@/server/db";
import type { MessageInput } from "@/lib/validation";

export interface MessageDTO {
  id: string;
  guestName: string;
  messageText: string;
  createdAt: string;
}

export async function listMessages(limit = 50): Promise<MessageDTO[]> {
  const rows = await prisma.message.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((m) => ({
    id: m.id,
    guestName: m.guestName,
    messageText: m.messageText,
    createdAt: m.createdAt.toISOString(),
  }));
}

export async function createMessage(input: MessageInput): Promise<MessageDTO> {
  const m = await prisma.message.create({ data: input });
  return {
    id: m.id,
    guestName: m.guestName,
    messageText: m.messageText,
    createdAt: m.createdAt.toISOString(),
  };
}
