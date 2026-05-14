import { test, expect } from '@playwright/test';

test.describe('Phase 4: Testimonials + Community', () => {
  
  test('Flow 1: Authenticated user can submit a testimonial', async ({ page }) => {
    // 1. Login as Membro (ALUNO_INTERNO)
    await page.goto('/login');
    await page.click('text=[ DEV_MODE ]');
    await page.click('text=Autofill Membro');
    await page.click('button:has-text("AUTHENTICATE")');
    
    // Wait for redirect to dashboard or home
    await page.waitForURL('**/dashboard/**');
    
    // 2. Go to Testimonials page
    await page.goto('/testimonials');
    
    // 3. Fill the submission form
    const testimonialText = `Automated Test Testimonial - ${Date.now()}`;
    await page.fill('textarea[placeholder*="Compartilhe"]', testimonialText);
    await page.check('input#lgpd-consent');
    
    // 4. Submit
    await page.click('button:has-text("SUBMIT_DEPOIMENTO")');
    
    // 5. Verify success message
    await expect(page.locator('text=DEPOIMENTO_ENVIADO')).toBeVisible();
    await expect(page.locator('text=Protocolo em análise pela equipe técnica.')).toBeVisible();
  });

  test('Flow 2: Admin can approve a testimonial and it appears on public page', async ({ page }) => {
    // 1. Submit a testimonial first (as Membro)
    await page.goto('/login');
    await page.click('text=[ DEV_MODE ]');
    await page.click('text=Autofill Membro');
    await page.click('button:has-text("AUTHENTICATE")');
    await page.waitForURL('**/dashboard/**');
    await page.goto('/testimonials');
    const testimonialText = `Approval Test - ${Date.now()}`;
    await page.fill('textarea[placeholder*="Compartilhe"]', testimonialText);
    await page.check('input#lgpd-consent');
    await page.click('button:has-text("SUBMIT_DEPOIMENTO")');
    
    // 2. Logout and Login as Orientador
    await page.goto('/login');
    await page.click('text=[ DEV_MODE ]');
    await page.click('text=Autofill Orientador');
    await page.click('button:has-text("AUTHENTICATE")');
    await page.waitForURL('**/dashboard/**');
    
    // 3. Go to Admin Testimonials Dashboard
    await page.goto('/dashboard/testimonials');
    
    // 4. Find the pending testimonial and approve it
    const row = page.locator('.glass-panel', { hasText: testimonialText });
    await expect(row).toBeVisible();
    await row.locator('button:has-text("APPROVE")').click();
    
    // 5. Verify it's no longer in pending status (or shows APPROVED)
    await expect(row.locator('text=APPROVED')).toBeVisible();
    
    // 6. Check public page
    await page.goto('/testimonials');
    await expect(page.locator('text=' + testimonialText)).toBeVisible();
  });

  test('Flow 3: Admin can update impact metrics', async ({ page }) => {
    // 1. Login as Orientador
    await page.goto('/login');
    await page.click('text=[ DEV_MODE ]');
    await page.click('text=Autofill Orientador');
    await page.click('button:has-text("AUTHENTICATE")');
    await page.waitForURL('**/dashboard/**');
    
    // 2. Go to Metrics Dashboard
    await page.goto('/dashboard/metrics');
    
    // 3. Update a metric
    const newValue = Math.floor(Math.random() * 1000).toString();
    await page.fill('input[name="totalStudents"]', newValue);
    await page.click('button:has-text("UPDATE_METRICS")');
    
    // 4. Verify persistence (reload page)
    await page.reload();
    await expect(page.locator('input[name="totalStudents"]')).toHaveValue(newValue);
  });
});
