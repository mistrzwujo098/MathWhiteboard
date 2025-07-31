import { test, expect } from '@playwright/test'
import { createTestUser, deleteTestUser } from './utils/auth'

test.describe('Real-time Collaboration', () => {
  let user1Email: string
  let user1Password: string
  let user2Email: string
  let user2Password: string
  let sessionUrl: string

  test.beforeEach(async ({ browser }) => {
    // Create two test users
    const user1 = await createTestUser()
    user1Email = user1.email
    user1Password = user1.password

    const user2 = await createTestUser()
    user2Email = user2.email
    user2Password = user2.password

    // Create session with first user
    const page1 = await browser.newPage()
    await page1.goto('/auth/login')
    await page1.getByPlaceholder('you@example.com').fill(user1Email)
    await page1.getByPlaceholder('••••••••').fill(user1Password)
    await page1.getByRole('button', { name: 'Sign In' }).click()
    await page1.waitForURL('/')

    await page1.getByPlaceholder('Math Tutoring Session').fill('Collaboration Test')
    await page1.getByRole('button', { name: 'Create Session' }).click()
    await page1.waitForURL(/\/session\/.+/)
    
    sessionUrl = page1.url()
    await page1.close()
  })

  test.afterEach(async () => {
    // Cleanup test users
    await deleteTestUser(user1Email)
    await deleteTestUser(user2Email)
  })

  test('should show multiple participants', async ({ browser }) => {
    // User 1 joins
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
    await page1.goto('/auth/login')
    await page1.getByPlaceholder('you@example.com').fill(user1Email)
    await page1.getByPlaceholder('••••••••').fill(user1Password)
    await page1.getByRole('button', { name: 'Sign In' }).click()
    await page1.goto(sessionUrl)

    // User 2 joins
    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    await page2.goto('/auth/login')
    await page2.getByPlaceholder('you@example.com').fill(user2Email)
    await page2.getByPlaceholder('••••••••').fill(user2Password)
    await page2.getByRole('button', { name: 'Sign In' }).click()
    await page2.goto(sessionUrl)

    // Wait for participants to update
    await page1.waitForTimeout(2000)
    await page2.waitForTimeout(2000)

    // Check both pages show 2 participants
    await expect(page1.getByText('(2)')).toBeVisible()
    await expect(page2.getByText('(2)')).toBeVisible()

    await context1.close()
    await context2.close()
  })

  test('should sync chat messages', async ({ browser }) => {
    // User 1 joins
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
    await page1.goto('/auth/login')
    await page1.getByPlaceholder('you@example.com').fill(user1Email)
    await page1.getByPlaceholder('••••••••').fill(user1Password)
    await page1.getByRole('button', { name: 'Sign In' }).click()
    await page1.goto(sessionUrl)

    // User 2 joins
    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    await page2.goto('/auth/login')
    await page2.getByPlaceholder('you@example.com').fill(user2Email)
    await page2.getByPlaceholder('••••••••').fill(user2Password)
    await page2.getByRole('button', { name: 'Sign In' }).click()
    await page2.goto(sessionUrl)

    // User 1 sends a message
    await page1.getByPlaceholder('Type a message...').fill('Hello from User 1!')
    await page1.getByRole('button', { name: 'Send' }).click()

    // Check message appears on both pages
    await expect(page1.getByText('Hello from User 1!')).toBeVisible()
    await expect(page2.getByText('Hello from User 1!')).toBeVisible()

    // User 2 sends a message
    await page2.getByPlaceholder('Type a message...').fill('Hello from User 2!')
    await page2.getByRole('button', { name: 'Send' }).click()

    // Check message appears on both pages
    await expect(page1.getByText('Hello from User 2!')).toBeVisible()
    await expect(page2.getByText('Hello from User 2!')).toBeVisible()

    await context1.close()
    await context2.close()
  })
})