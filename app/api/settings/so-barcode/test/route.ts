import { NextResponse } from "next/server";
import { getSession, hasPermission } from "@/lib/auth";
import { getIntegrationConfig } from "@/lib/configuration/integration-config";
export async function POST() { const session = await getSession(); if (!session) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 }); if (!hasPermission(session.role, "integration.test")) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 }); const config = await getIntegrationConfig(); if (!config.baseUrl) return NextResponse.json({ status: "UPSTREAM_HEALTH_UNVERIFIED", endpoint: "NOT_CONFIGURED" }); return NextResponse.json({ status: "UPSTREAM_HEALTH_UNVERIFIED", endpoint: `${config.baseUrl}${config.apiPath}` }); }
