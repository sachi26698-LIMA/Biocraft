import { executeGeneration, type GenerationJob } from './generationJobs';

self.onmessage = (event: MessageEvent<{ id: number; job: GenerationJob }>) => {
  try {
    self.postMessage({ id: event.data.id, result: executeGeneration(event.data.job) });
  } catch {
    self.postMessage({ id: event.data.id, failed: true });
  }
};
