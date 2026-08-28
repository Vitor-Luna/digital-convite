/**
 * Postgres local para desenvolvimento — Postgres REAL embutido, sem Docker.
 *
 *   node scripts/pg.mjs start   inicia e mantém o servidor rodando (Ctrl+C para parar)
 *   node scripts/pg.mjs stop    para um servidor iniciado em outro terminal
 *
 * Dados persistem em .pgdata/ (ignorado pelo git).
 * Connection string: postgresql://postgres:postgres@localhost:5433/bes
 */
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const DATA_DIR = path.resolve(process.cwd(), ".pgdata");
const PORT = 5433;
const DB_NAME = "bes";
const URL = `postgresql://postgres:postgres@localhost:${PORT}/${DB_NAME}`;

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  port: PORT,
  user: "postgres",
  password: "postgres",
  authMethod: "password",
  persistent: true,
  onLog: () => {},
  onError: (m) => {
    const s = String(m);
    if (!s.includes("database system was shut down")) console.error(s);
  },
});

const cmd = process.argv[2] ?? "start";

function killPort() {
  if (process.platform === "win32") {
    const out = spawnSync("netstat", ["-ano"], { encoding: "utf8" }).stdout || "";
    const pids = new Set();
    for (const line of out.split("\n")) {
      if (line.includes(`:${PORT} `) && line.includes("LISTENING")) {
        const pid = line.trim().split(/\s+/).pop();
        if (pid && pid !== "0") pids.add(pid);
      }
    }
    for (const pid of pids) {
      spawnSync("taskkill", ["/PID", pid, "/F", "/T"], { stdio: "ignore" });
    }
    return pids.size;
  }
  const r = spawnSync("bash", ["-c", `lsof -ti tcp:${PORT} | xargs -r kill`], {
    stdio: "ignore",
  });
  return r.status === 0 ? 1 : 0;
}

if (cmd === "stop") {
  const n = killPort();
  console.log(n ? "Postgres local parado." : "Nenhum Postgres local rodando na porta 5433.");
  process.exit(0);
}

if (cmd !== "start") {
  console.error(`Comando desconhecido: ${cmd}. Use "start" ou "stop".`);
  process.exit(1);
}

const initialised = existsSync(path.join(DATA_DIR, "PG_VERSION"));

try {
  if (!initialised) {
    console.log("Inicializando o cluster Postgres em .pgdata/ (só na primeira vez)...");
    await pg.initialise();
  }
  await pg.start();
} catch (err) {
  const msg = String(err);
  if (msg.includes("EADDRINUSE") || msg.includes("address already in use")) {
    console.log(`\n  Já existe um Postgres rodando na porta ${PORT}.`);
    console.log(`  Connection string: ${URL}\n`);
    process.exit(0);
  }
  console.error("Falha ao iniciar o Postgres:", msg);
  process.exit(1);
}

try {
  await pg.createDatabase(DB_NAME);
} catch {
  /* o banco já existe — tudo certo */
}

console.log(`
  ✔ Postgres local pronto.

  DATABASE_URL="${URL}"

  Deixe este terminal aberto enquanto desenvolve. Ctrl+C para parar.
`);

const shutdown = async () => {
  console.log("\nParando o Postgres...");
  try {
    await pg.stop();
  } catch {
    /* ignora */
  }
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// mantém o processo vivo
await new Promise(() => {});
