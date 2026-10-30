import { Worker } from "bullmq";
import { runBatch } from "../lib/bulk";

const url = process.env.REDIS_URL;
if (!url) throw new Error("REDIS_NOT_CONFIGURED");

const worker = new Worker("digipos-sellout", async job => {
  await runBatch(String(job.data.jobId));
}, { connection: { url }, concurrency: Number(process.env.QUEUE_CONCURRENCY || 1) });

worker.on("failed", (job, error) => console.error("sellout worker failed", job?.id, error.message));
