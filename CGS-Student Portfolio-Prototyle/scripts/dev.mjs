import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targetName = 'CGS-Attendance-prototype-main';
const targetRoot = path.join(workspaceRoot, targetName);

if (!existsSync(targetRoot)) {
  console.error(`Cannot start CGS HUB: the required "${targetName}" folder is missing. Place "${targetName}" inside the Student portfolio directory, beside package.json, then run npm run dev again.`);
  process.exit(1);
}

// Support both a project pasted directly into the target folder and the
// existing double-nested archive layout, without relying on a machine path.
const appRoot = existsSync(path.join(targetRoot, 'frontend', 'package.json'))
  ? targetRoot
  : path.join(targetRoot, targetName);
const frontendRoot = path.join(appRoot, 'frontend');
const backendRoot = path.join(appRoot, 'backend');
for (const [label, folder] of [['frontend', frontendRoot], ['backend', backendRoot]]) {
  if (!existsSync(path.join(folder, 'package.json'))) {
    console.error(`Cannot start CGS HUB: the ${label} package was not found under "${targetName}". Place the complete project folder inside the Student portfolio directory.`);
    process.exit(1);
  }
}

const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error('Run this command with `npm run dev` from the Student portfolio directory.');
  process.exit(1);
}

const services = process.argv[2] === 'web'
  ? [['Next.js web', frontendRoot, ['run', 'dev']]]
  : process.argv[2] === 'api'
    ? [['NestJS API', backendRoot, ['run', 'start:dev']]]
    : process.argv[2] === 'build'
      ? [['NestJS API build', backendRoot, ['run', 'build']], ['Next.js build', frontendRoot, ['run', 'build']]]
      : process.argv[2] === 'db:push'
        ? [['Database schema', backendRoot, ['run', 'prisma:push']]]
        : process.argv[2] === 'db:seed'
          ? [['Demo data seed', backendRoot, ['run', 'seed']]]
          : [['NestJS API', backendRoot, ['run', 'start:dev']], ['Next.js web', frontendRoot, ['run', 'dev']]];

const baseEnv = {
  ...process.env,
  HOST: 'localhost',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cgs_hub?schema=public',
};
const children = services.map(([name, cwd, args]) => {
  const child = spawn(process.execPath, [npmCli, ...args], { cwd, stdio: 'inherit', env: baseEnv });
  child.on('error', (error) => console.error(`${name} could not start: ${error.message}`));
  child.on('exit', (code) => {
    if (code && code !== 0) console.error(`${name} stopped with exit code ${code}`);
  });
  return child;
});

function stopAll() {
  for (const child of children) child.kill();
}
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
