import { Queue } from "bullmq";

export interface JobQueue { enqueue(jobId: string): Promise<void>; pause(jobId: string): Promise<void>; resume(jobId: string): Promise<void>; cancel(jobId: string): Promise<void>; retryFailed(jobId: string): Promise<void>; }

export class BullMqJobQueue implements JobQueue {
  private queue() { const url = process.env.REDIS_URL; if (!url) throw new Error("REDIS_NOT_CONFIGURED"); return new Queue("digipos-sellout", { connection: { url } }); }
  async enqueue(jobId: string) { const queue = this.queue(); await queue.add("sellout", { jobId }, { jobId: `sellout:${jobId}`, attempts: 1, removeOnComplete: false, removeOnFail: false }); await queue.close(); }
  async pause(jobId: string) { void jobId; }
  async resume(jobId: string) { void jobId; }
  async cancel(jobId: string) { const queue = this.queue(); const job = await queue.getJob(`sellout:${jobId}`); if (job) await job.remove(); await queue.close(); }
  async retryFailed(jobId: string) { await this.enqueue(jobId); }
}

export class MemoryJobQueue implements JobQueue {
  readonly events: string[] = [];
  async enqueue(jobId: string) { this.events.push(`enqueue:${jobId}`); }
  async pause(jobId: string) { this.events.push(`pause:${jobId}`); }
  async resume(jobId: string) { this.events.push(`resume:${jobId}`); }
  async cancel(jobId: string) { this.events.push(`cancel:${jobId}`); }
  async retryFailed(jobId: string) { this.events.push(`retry:${jobId}`); }
}

export function getJobQueue(): JobQueue {
  if (process.env.REDIS_URL) return new BullMqJobQueue();
  if (process.env.NODE_ENV === "test" || process.env.PERSISTENCE_MODE === "MOCK") return new MemoryJobQueue();
  throw new Error("REDIS_NOT_CONFIGURED");
}
