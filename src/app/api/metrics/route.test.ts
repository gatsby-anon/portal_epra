import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

vi.mock('@/lib/db', () => ({
  default: {
    impactMetrics: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

describe('Metrics API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return metrics if exists', async () => {
      const mockMetrics = { id: 'singleton', totalStudents: 100 };
      (prisma.impactMetrics.findUnique as any).mockResolvedValue(mockMetrics);

      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.metrics).toEqual(mockMetrics);
    });

    it('should return default metrics if not exists', async () => {
      (prisma.impactMetrics.findUnique as any).mockResolvedValue(null);

      const res = await GET();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.metrics.totalStudents).toBe(0);
    });
  });

  describe('POST', () => {
    it('should allow ORIENTADOR to update metrics', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'admin-1', role: 'ORIENTADOR' });
      (prisma.impactMetrics.upsert as any).mockResolvedValue({ id: 'singleton', totalStudents: 200 });

      const req = new NextRequest('http://localhost/api/metrics', {
        method: 'POST',
        body: JSON.stringify({ totalStudents: 200 }),
        headers: { 'cookie': 'token=admin-token' }
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.impactMetrics.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'singleton' },
        update: expect.objectContaining({ totalStudents: 200 })
      }));
    });

    it('should forbid regular users from updating metrics', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'user-1', role: 'USUARIO_EXTERNO' });

      const req = new NextRequest('http://localhost/api/metrics', {
        method: 'POST',
        body: JSON.stringify({ totalStudents: 200 }),
        headers: { 'cookie': 'token=user-token' }
      });

      const res = await POST(req);
      expect(res.status).toBe(403);
    });
  });
});
