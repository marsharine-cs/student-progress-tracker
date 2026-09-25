import { expect, test } from '@playwright/test'

test.describe('public authentication experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('exposes labeled sign-up controls and keyboard focus', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()

    await page.keyboard.press('Tab')
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeFocused()
  })

  test('moves between sign-up, login, and password recovery', async ({ page }) => {
    await page.getByRole('button', { name: /already have an account/i }).click()
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible()

    await page.getByRole('button', { name: /forgot your password/i }).click()
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible()
    await expect(page.getByLabel('Password')).toHaveCount(0)

    await page.getByRole('button', { name: /back to log in/i }).click()
    await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible()
  })

  test('uses native validation before submitting incomplete credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Up' }).click()

    const email = page.getByRole('textbox', { name: 'Email address' })
    await expect(email).toBeFocused()
    await expect(email).toHaveJSProperty('validity.valueMissing', true)
  })
})
