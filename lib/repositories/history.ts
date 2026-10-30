import { getDb, isDatabaseConfigured } from "@/lib/db";
export async function findTransactionHistory(accountIds: string[], filters: { status?: string; accountId?: string; requestId?: string }) {
  if (!isDatabaseConfigured) return [];
  return getDb().transaction.findMany({ where: { digiposAccountId: filters.accountId && accountIds.includes(filters.accountId) ? filters.accountId : { in: accountIds }, status: filters.status, requestId: filters.requestId }, orderBy: { createdAt: "desc" }, take: 500 });
}
