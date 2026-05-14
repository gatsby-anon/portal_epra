import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '..', 'local_db_dump.json');
  if (!fs.existsSync(dataPath)) {
    console.error('Local dump not found!');
    return;
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);

  console.log('Seeding real data...');

  const passwordHash = await hash('orientador123', 10);

  // 1. Users
  for (const u of data.user) {
    const isOrientador = u.role === 'ORIENTADOR';
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        role: u.role,
        isActive: u.isActive,
        isEmailConfirmed: u.isEmailConfirmed,
        password: isOrientador ? passwordHash : u.password
      },
      create: {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        password: isOrientador ? passwordHash : u.password,
        role: u.role,
        course: u.course,
        isActive: u.isActive,
        isEmailConfirmed: u.isEmailConfirmed,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt)
      }
    });
  }

  console.log(`- ${data.user.length} Users synced`);

  // 2. Courses
  for (const c of data.course) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        titulo: c.titulo,
        descricao: c.descricao,
        cargaHoraria: c.cargaHoraria,
        vagas: c.vagas,
        dataLimite: new Date(c.dataLimite),
        horario: c.horario,
        instrutor: c.instrutor,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }
    });
  }
  console.log(`- ${data.course.length} Courses synced`);

  // 3. Challenges
  for (const ch of data.challenge) {
    await prisma.challenge.upsert({
      where: { id: ch.id },
      update: {},
      create: {
        id: ch.id,
        titulo: ch.titulo,
        descricao: ch.descricao,
        dataLimite: new Date(ch.dataLimite),
        urlGithub: ch.urlGithub,
        instrutor: ch.instrutor,
        createdAt: new Date(ch.createdAt),
        updatedAt: new Date(ch.updatedAt)
      }
    });
  }
  console.log(`- ${data.challenge.length} Challenges synced`);

  // 4. Opportunities
  for (const op of data.opportunity) {
    await prisma.opportunity.upsert({
      where: { id: op.id },
      update: {},
      create: {
        id: op.id,
        titulo: op.titulo,
        descricao: op.descricao,
        vagas: op.vagas,
        dataLimite: op.dataLimite ? new Date(op.dataLimite) : null,
        status: op.status,
        createdAt: new Date(op.createdAt),
        updatedAt: new Date(op.updatedAt)
      }
    });
  }
  console.log(`- ${data.opportunity.length} Opportunities synced`);

  // 5. Gallery Images
  for (const img of data.galleryImage) {
    await prisma.galleryImage.upsert({
      where: { id: img.id },
      update: {},
      create: {
        id: img.id,
        url: img.url,
        alt: img.alt,
        createdAt: new Date(img.createdAt)
      }
    });
  }
  console.log(`- ${data.galleryImage.length} Gallery Images synced`);

  // 6. Resources
  for (const res of data.libraryResource) {
    await prisma.libraryResource.upsert({
      where: { id: res.id },
      update: {},
      create: {
        id: res.id,
        titulo: res.titulo,
        descricao: res.descricao,
        categoria: res.categoria,
        linguagem: res.linguagem,
        tags: res.tags,
        link: res.link,
        downloadCount: res.downloadCount,
        createdById: res.createdById,
        createdAt: new Date(res.createdAt),
        updatedAt: new Date(res.updatedAt)
      }
    });
  }
  console.log(`- ${data.libraryResource.length} Library Resources synced`);

  // 7. Impact Metrics (Official from content.json as fallback)
  await prisma.impactMetrics.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      totalStudents: 847,
      projectsCompleted: 156,
      hardwareKits: 42,
      communityReach: 3240
    }
  });
  console.log('- Impact Metrics synced');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());