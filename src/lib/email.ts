import nodemailer from 'nodemailer';

const isSmtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = isSmtpConfigured 
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

export async function sendActivationEmail(to: string, token: string): Promise<void> {
  const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/activate-v2?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00d4ff;">Ativação de Conta - EPRA</h2>
      <p>Olá! Obrigado por se registrar no EPRA Portal.</p>
      <p>Clique no botão abaixo para ativar sua conta:</p>
      <a href="${activationUrl}" style="display: inline-block; background: #00d4ff; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Ativar Conta</a>
      <p>Ou copie este link: ${activationUrl}</p>
      <p style="color: #666; font-size: 12px;">Este link expira em 24 horas.</p>
    </div>
  `;

  if (!transporter) {
    console.log('📧 [MOCK EMAIL] Activation Email');
    console.log(`To: ${to}`);
    console.log(`Link: ${activationUrl}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@epra.ufc.br',
      to,
      subject: 'Ative sua conta - EPRA Portal',
      html,
    });
  } catch (error) {
    console.error('[EMAIL] Failed to send activation email:', error);
  }
}

export async function sendConfirmationEmail(to: string, vagaTitulo: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #00d4ff;">Confirmação de Candidatura - EPRA</h2>
      <p>Olá!</p>
      <p>Sua inscrição para a vaga <strong>${vagaTitulo}</strong> foi recebida com sucesso.</p>
      <p>Em breve entraremos em contato com os próximos passos.</p>
      <p style="color: #666; font-size: 12px;">EPRA Portal - Junte-se ao time!</p>
    </div>
  `;

  if (!transporter) {
    console.log('📧 [MOCK EMAIL] Confirmation Email');
    console.log(`To: ${to}`);
    console.log(`Vaga: ${vagaTitulo}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'noreply@epra.ufc.br',
      to,
      subject: `Confirmação de candidatura - ${vagaTitulo}`,
      html,
    });
  } catch (error) {
    console.error('[EMAIL] Failed to send confirmation email:', error);
  }
}