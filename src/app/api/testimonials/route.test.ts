import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

vi.mock('@/lib/db', () => ({
  default: {
    testimonial: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

describe('Testimonials API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return only approved testimonials by default', async () => {
      const mockTestimonials = [{ id: '1', text: 'Great!', status: 'APPROVED' }];
      (prisma.testimonial.findMany as any).mockResolvedValue(mockTestimonials);

      const req = new NextRequest('http://localhost:3000/api/testimonials');
      const res = await GET(req);
      const data = await res.json();

      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { status: 'APPROVED' }
      }));
      expect(data.testimonials).toEqual(mockTestimonials);
    });

    it('should return all testimonials if all=true is passed', async () => {
      const mockTestimonials = [{ id: '1', text: 'Great!', status: 'PENDING' }];
      (prisma.testimonial.findMany as any).mockResolvedValue(mockTestimonials);

      const req = new NextRequest('http://localhost:3000/api/testimonials?all=true');
      const res = await GET(req);
      const data = await res.json();

      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {}
      }));
      expect(data.testimonials).toEqual(mockTestimonials);
    });
  });

  describe('POST', () => {
    it('should return 401 if no token is provided', async () => {
      const req = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify({ text: 'Hello', lgpdConsent: true }),
      });
      
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should create a pending testimonial if authorized', async () => {
      const mockUser = { id: 'user-123', email: 'test@test.com', role: 'ALUNO_INTERNO' };
      (verifyToken as any).mockResolvedValue(mockUser);
      (prisma.testimonial.create as any).mockResolvedValue({ id: 't-1', status: 'PENDING' });

      const req = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify({ text: 'Wonderful!', lgpdConsent: true }),
        headers: {
          'cookie': 'token=valid-token'
        }
      });
      
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(prisma.testimonial.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-123',
          text: 'Wonderful!',
          status: 'PENDING',
          lgpdConsent: true
        })
      }));
    });

    it('should return 400 if lgpdConsent is missing', async () => {
      const mockUser = { id: 'user-123', email: 'test@test.com', role: 'ALUNO_INTERNO' };
      (verifyToken as any).mockResolvedValue(mockUser);

      const req = new NextRequest('http://localhost:3000/api/testimonials', {
        method: 'POST',
        body: JSON.stringify({ text: 'Wonderful!', lgpdConsent: false }),
        headers: {
          'cookie': 'token=valid-token'
        }
      });
      
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('LGPD consent is required');
    });
  });
});
