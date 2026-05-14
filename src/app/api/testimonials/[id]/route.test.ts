import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH, DELETE } from './route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

vi.mock('@/lib/db', () => ({
  default: {
    testimonial: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

describe('Testimonial ID API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return testimonial if found', async () => {
      const mockTestimonial = { id: 't-1', text: 'Great!', userId: 'u-1' };
      (prisma.testimonial.findUnique as any).mockResolvedValue(mockTestimonial);

      const res = await GET(new NextRequest('http://localhost/api/testimonials/t-1'), {
        params: Promise.resolve({ id: 't-1' })
      });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.testimonial).toEqual(mockTestimonial);
    });

    it('should return 404 if not found', async () => {
      (prisma.testimonial.findUnique as any).mockResolvedValue(null);

      const res = await GET(new NextRequest('http://localhost/api/testimonials/none'), {
        params: Promise.resolve({ id: 'none' })
      });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH', () => {
    it('should allow ORIENTADOR to approve', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'admin-1', role: 'ORIENTADOR' });
      (prisma.testimonial.update as any).mockResolvedValue({ id: 't-1', status: 'APPROVED' });

      const req = new NextRequest('http://localhost/api/testimonials/t-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'APPROVED' }),
        headers: { 'cookie': 'token=admin-token' }
      });

      const res = await PATCH(req, { params: Promise.resolve({ id: 't-1' }) });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(prisma.testimonial.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 't-1' },
        data: { status: 'APPROVED' }
      }));
    });

    it('should forbid regular users from managing status', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'user-1', role: 'USUARIO_EXTERNO' });

      const req = new NextRequest('http://localhost/api/testimonials/t-1', {
        method: 'PATCH',
        body: JSON.stringify({ status: 'APPROVED' }),
        headers: { 'cookie': 'token=user-token' }
      });

      const res = await PATCH(req, { params: Promise.resolve({ id: 't-1' }) });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE', () => {
    it('should allow author to delete their own testimonial', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'user-1', role: 'ALUNO_INTERNO' });
      (prisma.testimonial.findUnique as any).mockResolvedValue({ id: 't-1', userId: 'user-1' });

      const req = new NextRequest('http://localhost/api/testimonials/t-1', {
        method: 'DELETE',
        headers: { 'cookie': 'token=user-token' }
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: 't-1' }) });
      expect(res.status).toBe(200);
      expect(prisma.testimonial.delete).toHaveBeenCalled();
    });

    it('should forbid deleting someone else\'s testimonial', async () => {
      (verifyToken as any).mockResolvedValue({ id: 'user-2', role: 'ALUNO_INTERNO' });
      (prisma.testimonial.findUnique as any).mockResolvedValue({ id: 't-1', userId: 'user-1' });

      const req = new NextRequest('http://localhost/api/testimonials/t-1', {
        method: 'DELETE',
        headers: { 'cookie': 'token=user-token' }
      });

      const res = await DELETE(req, { params: Promise.resolve({ id: 't-1' }) });
      expect(res.status).toBe(403);
    });
  });
});
