const DEFAULT_DELAY_MS = 1000;

export async function mockFetch<T>(
  data: T,
  delayMs: number = DEFAULT_DELAY_MS,
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delayMs);
  });
}
