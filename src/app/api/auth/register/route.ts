import { NextResponse } from 'next/server';
import { RegisterPayload } from '@/types/user';
import { prisma } from '@/lib/db';
import { generateActivationToken, validatePassword } from '@/lib/auth-utils';
import { sendActivationEmail } from '@/lib/email';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body: RegisterPayload = await request.json();
    const { fullName, email, password, course } = body;

    // Validation
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists in REAL database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generate activation token
    const { token: activationToken, expires: activationExpires } = generateActivationToken();

    // Hash password with BCRYPT
    const passwordHash = await hash(password, 12);

    // Create user in REAL database
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: passwordHash,
        role: 'USUARIO_EXTERNO',
        course,
        isActive: true, 
        isEmailConfirmed: true, // AUTO-CONFIRMED for now as requested
        activationToken,
        activationExpires
      }
    });

    // Disparar e-mail de ativação REAL
    await sendActivationEmail(newUser.email, activationToken);

    // Omit sensitive data
    const { password: _, activationToken: __, ...userWithoutSensitiveData } = newUser;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful. Check your email to activate your account.',
        user: userWithoutSensitiveData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
