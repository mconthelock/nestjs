// retry.util.ts
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export async function retry<T>(
  task: () => Promise<T>,
  opt: { retries?: number; baseMs?: number; maxDelayMs?: number } = {},
): Promise<T> {
  const { retries = 5, baseMs = 100, maxDelayMs = 2000 } = opt;
  let lastErr: any;
  for (let i = 0; i <= retries; i++) {
    try { return await task(); } 
    catch (e) {
      lastErr = e;
      if (i === retries) break;
      const delay = Math.min(maxDelayMs, baseMs * 2 ** i) + Math.floor(Math.random() * 100);
      await sleep(delay);
    }
  }
  throw lastErr;
}

// ตัวอย่างการใช้งาน
// import { retry } from 'src/common/utils/retry.utils';
// await retry(() => someAsyncFunction(), { retries: 3, baseMs: 200, maxDelayMs: 1000 });
// await retry(() => this.pisLocks.releaseByEmpno(empno), { retries: 5, baseMs: 200 });
