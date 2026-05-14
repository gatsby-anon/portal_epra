import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const start = Date.now();
  try {
    // Basic connectivity check
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return NextResponse.json({
      status: "online",
      database: "Neon Serverless (PostgreSQL)",
      region: "sa-east-1 (AWS)",
      latency: `${latency}ms`,
      runtime: "Node.js 20.x",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Infra Ping Error:', error);
    return NextResponse.json({
      status: "offline",
      error: "Database unreachable"
    }, { status: 500 });
  }
}
