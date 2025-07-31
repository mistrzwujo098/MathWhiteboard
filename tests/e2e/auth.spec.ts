import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/auth/login')
    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL(/\/auth\/signup/)
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  })

  test('should show signup form', async ({ page }) => {
    await page.goto('/auth/signup')
    await expect(page.getByPlaceholder('John Doe')).toBeVisible()
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  test('should validate signup form', async ({ page }) => {
    await page.goto('/auth/signup')
    await page.getByRole('button', { name: 'Sign Up' }).click()
    
    // Check for HTML5 validation
    const emailInput = page.getByPlaceholder('you@example.com')
    const validationMessage = await emailInput.evaluate((el: HTMLInputElement) => el.validationMessage)
    expect(validationMessage).not.toBe('')
  })
})