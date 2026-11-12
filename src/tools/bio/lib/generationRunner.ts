import { executeGeneration, type GenerationJob } from './generationJobs';

/** A single latest-wins worker, terminated when its pending job is superseded. */
export class GenerationRunner {
  private worker: Worker | null = null;
  private pending: { id: number; resolve: (result: string[] | null) => void } | null = null;
  private sequence = 0;

  cancel() {
    this.sequence++;
    if (this.pending) {
      this.pending.resolve(null);
      this.pending = null;
      // A worker cannot interrupt synchronous computation within a job.
      this.worker?.terminate();
      this.worker = null;
    }
  }

  dispose() {
    this.cancel();
    this.worker?.terminate();
    this.worker = null;
  }

  run(job: GenerationJob): Promise<string[] | null> {
    this.cancel();
    const id = this.sequence;
    return new Promise((resolve, reject) => {
      this.pending = { id, resolve };
      const finish = (result: string[]) => {
        if (this.pending?.id !== id) return;
        this.pending = null;
        resolve(result);
      };
      const fail = () => {
        if (this.pending?.id !== id) return;
        this.pending = null;
        reject(new Error('Bio generation failed'));
      };
      // Older browsers and restrictive CSPs still work without a worker.
      const fallback = () => {
        if (this.pending?.id !== id) return;
        this.worker?.terminate();
        this.worker = null;
        Promise.resolve().then(() => {
          if (this.pending?.id !== id) return;
          try { finish(executeGeneration(job)); } catch { fail(); }
        });
      };
      try {
        if (typeof Worker === 'undefined') { fallback(); return; }
        this.worker ??= new Worker(new URL('./generationWorker.ts', import.meta.url), { type: 'module' });
        this.worker.onmessage = (event: MessageEvent<{ id: number; result?: string[]; failed?: boolean }>) => {
          if (event.data.id !== id || this.pending?.id !== id) return;
          if (event.data.failed || !event.data.result) fail();
          else finish(event.data.result);
        };
        this.worker.onerror = () => fallback();
        this.worker.postMessage({ id, job });
      } catch { fallback(); }
    });
  }
}
