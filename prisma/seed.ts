/**
 * Seed de desenvolvimento.
 *
 * Cria confirmações em estados variados para que o painel administrativo
 * tenha dados realistas (incluindo o exemplo canônico de 4 pessoas).
 *
 * Rode com:  npm run db:seed
 * É idempotente: limpa as tabelas antes de inserir.
 */
import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type PersonSeed = { fullName: string; age: number; phone: string };

function group(
  contactName: string,
  main: PersonSeed,
  companions: PersonSeed[],
): Prisma.PersonCreateManySubmissionInput[] {
  return [
    { ...main, isCompanion: false },
    ...companions.map((c) => ({ ...c, isCompanion: true })),
  ];
}

async function main() {
  await prisma.person.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.message.deleteMany();

  // 1) Exemplo canônico: 4 pessoas, aprovado, cerimônia + restaurante.
  await prisma.submission.create({
    data: {
      willAttend: true,
      attendanceType: "CEREMONY_AND_RESTAURANT",
      approvalStatus: "APPROVED",
      contactName: "João Pereira",
      people: {
        createMany: {
          data: group(
            "João Pereira",
            { fullName: "João Pereira", age: 34, phone: "(12) 99999-0001" },
            [
              { fullName: "Bianca Pereira", age: 32, phone: "(12) 99999-0002" },
              { fullName: "Théo Pereira", age: 6, phone: "(12) 99999-0002" },
              { fullName: "Lara Pereira", age: 4, phone: "(12) 99999-0002" },
            ],
          ),
        },
      },
    },
  });

  // 2) Pendente, somente cerimônia, 2 pessoas.
  await prisma.submission.create({
    data: {
      willAttend: true,
      attendanceType: "CEREMONY_ONLY",
      approvalStatus: "PENDING",
      contactName: "Marina Alves",
      people: {
        createMany: {
          data: group(
            "Marina Alves",
            { fullName: "Marina Alves", age: 28, phone: "(11) 98888-1010" },
            [{ fullName: "Rafael Alves", age: 30, phone: "(11) 98888-1011" }],
          ),
        },
      },
    },
  });

  // 3) Pendente, cerimônia + restaurante, 1 pessoa.
  await prisma.submission.create({
    data: {
      willAttend: true,
      attendanceType: "CEREMONY_AND_RESTAURANT",
      approvalStatus: "PENDING",
      contactName: "Carla Nogueira",
      people: {
        createMany: {
          data: group(
            "Carla Nogueira",
            { fullName: "Carla Nogueira", age: 41, phone: "(12) 97777-2020" },
            [],
          ),
        },
      },
    },
  });

  // 4) Desaprovado, cerimônia + restaurante, 3 pessoas.
  await prisma.submission.create({
    data: {
      willAttend: true,
      attendanceType: "CEREMONY_AND_RESTAURANT",
      approvalStatus: "DISAPPROVED",
      contactName: "Pedro Santos",
      people: {
        createMany: {
          data: group(
            "Pedro Santos",
            { fullName: "Pedro Santos", age: 25, phone: "(21) 96666-3030" },
            [
              { fullName: "Ana Santos", age: 24, phone: "(21) 96666-3031" },
              { fullName: "Luiza Costa", age: 23, phone: "(21) 96666-3032" },
            ],
          ),
        },
      },
    },
  });

  // 5) Recusa registrada.
  await prisma.submission.create({
    data: {
      willAttend: false,
      attendanceType: null,
      approvalStatus: "PENDING",
      contactName: "Fernanda Lima",
      note: "Estarei viajando na data. Desejo toda felicidade ao casal!",
    },
  });

  // 6) Mural de recados.
  await prisma.message.createMany({
    data: [
      {
        guestName: "Tia Rosa",
        messageText:
          "Que Deus abençoe essa união. Estamos muito felizes por vocês!",
      },
      {
        guestName: "Lucas e Priscila",
        messageText: "Contando os dias! Vai ser lindo.",
      },
    ],
  });

  const [submissions, people, messages] = await Promise.all([
    prisma.submission.count(),
    prisma.person.count(),
    prisma.message.count(),
  ]);

  console.log(
    `Seed concluído: ${submissions} confirmações, ${people} pessoas, ${messages} recados.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
