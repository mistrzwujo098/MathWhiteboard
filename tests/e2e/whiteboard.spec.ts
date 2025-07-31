import { test, expect } from '@playwright/test'
import { createTestUser, deleteTestUser } from './utils/auth'

test.describe('Whiteboard Features', () => {
  let userEmail: string
  let userPassword: string

  test.beforeEach(async ({ page }) => {
    // Create a test user and login
    const testUser = await createTestUser()
    userEmail = testUser.email
    userPassword = testUser.password

    // Login
    await page.goto('/auth/login')
    await page.getByPlaceholder('you@example.com').fill(userEmail)
    await page.getByPlaceholder('••••••••').fill(userPassword)
    await page.getByRole('button', { name: 'Sign In' }).click()
    await page.waitForURL('/')
  })

  test.afterEach(async () => {
    // Cleanup test user
    await deleteTestUser(userEmail)
  })

  test('should create a new session', async ({ page }) => {
    await page.getByPlaceholder('Math Tutoring Session').fill('Test Session')
    await page.getByRole('button', { name: 'Create Session' }).click()
    
    // Should redirect to session page
    await expect(page).toHaveURL(/\/session\/.+/)
    await expect(page.getByText('Test Session')).toBeVisible()
  })

  test('should show whiteboard tools', async ({ page }) => {
    // Create session first
    await page.getByPlaceholder('Math Tutoring Session').fill('Tool Test')
    await page.getByRole('button', { name: 'Create Session' }).click()
    await page.waitForURL(/\/session\/.+/)

    // Check toolbar is visible
    await expect(page.getByTitle('Pen')).toBeVisible()
    await expect(page.getByTitle('Eraser')).toBeVisible()
    await expect(page.getByTitle('Select')).toBeVisible()
    await expect(page.getByTitle('Text')).toBeVisible()
    await expect(page.getByTitle('Line')).toBeVisible()
    await expect(page.getByTitle('Rectangle')).toBeVisible()
    await expect(page.getByTitle('Circle')).toBeVisible()
    await expect(page.getByTitle('Triangle')).toBeVisible()
    await expect(page.getByTitle('LaTeX Formula')).toBeVisible()
    await expect(page.getByTitle('Function Graph')).toBeVisible()
  })

  test('should open LaTeX modal', async ({ page }) => {
    // Create session
    await page.getByPlaceholder('Math Tutoring Session').fill('LaTeX Test')
    await page.getByRole('button', { name: 'Create Session' }).click()
    await page.waitForURL(/\/session\/.+/)

    // Click LaTeX button
    await page.getByTitle('LaTeX Formula').click()
    
    // Check modal appears
    await expect(page.getByRole('heading', { name: 'Insert LaTeX Formula' })).toBeVisible()
    await expect(page.getByPlaceholder('Enter LaTeX code here')).toBeVisible()
    await expect(page.getByText('Preview')).toBeVisible()
  })

  test('should open graph modal', async ({ page }) => {
    // Create session
    await page.getByPlaceholder('Math Tutoring Session').fill('Graph Test')
    await page.getByRole('button', { name: 'Create Session' }).click()
    await page.waitForURL(/\/session\/.+/)

    // Click Graph button
    await page.getByTitle('Function Graph').click()
    
    // Check modal appears
    await expect(page.getByRole('heading', { name: 'Insert Function Graph' })).toBeVisible()
    await expect(page.getByPlaceholder('e.g., x^2 + 2*x + 1')).toBeVisible()
    await expect(page.getByText('X Min')).toBeVisible()
    await expect(page.getByText('X Max')).toBeVisible()
  })

  test('should toggle chat panel', async ({ page }) => {
    // Create session
    await page.getByPlaceholder('Math Tutoring Session').fill('Chat Test')
    await page.getByRole('button', { name: 'Create Session' }).click()
    await page.waitForURL(/\/session\/.+/)

    // Chat should be visible by default
    await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible()
    
    // Toggle chat off
    await page.getByRole('button', { name: 'Chat' }).click()
    await expect(page.getByRole('heading', { name: 'Chat' })).not.toBeVisible()
    
    // Toggle chat back on
    await page.getByRole('button', { name: 'Chat' }).click()
    await expect(page.getByRole('heading', { name: 'Chat' })).toBeVisible()
  })

  test('should show share modal', async ({ page }) => {
    // Create session
    await page.getByPlaceholder('Math Tutoring Session').fill('Share Test')
    await page.getByRole('button', { name: 'Create Session' }).click()
    await page.waitForURL(/\/session\/.+/)

    // Click share button
    await page.getByRole('button', { name: 'Share' }).click()
    
    // Check modal appears
    await expect(page.getByRole('heading', { name: 'Share Session' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible()
  })
})