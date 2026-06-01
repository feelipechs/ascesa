import { type FullConfig } from '@playwright/test'
import { execSync } from 'node:child_process'

async function globalTeardown(_config: FullConfig) {
  void _config
  try {
    execSync('npx dotenv-cli -e .env.test -- npx tsx prisma/seed-test.ts', {
      stdio: 'pipe',
      cwd: process.cwd(),
    })
  } catch {
    // reseed is best-effort — don't fail the test run
  }
}

export default globalTeardown
