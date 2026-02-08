import { test, expect } from '@playwright/test'

/**
 * Helper: waits for task cards to fully load on the board.
 * Uses the task-card-menu data-testid as the reliable indicator
 * that task cards have been rendered.
 */
async function waitForTasksToLoad(page: import('@playwright/test').Page) {
  const taskCardMenu = page.getByTestId('task-card-menu')
  await expect(taskCardMenu.first()).toBeAttached({ timeout: 30000 })
}

test.describe('Task Management - Read Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForTasksToLoad(page)
  })

  test('should load and display the dashboard with task board', async ({ page }) => {
    // Verify the main heading
    await expect(page.getByRole('heading', { name: 'HR Tasks Hub' })).toBeVisible()

    // Verify Kanban column headers are visible
    await expect(page.locator('h3').filter({ hasText: 'To-do' })).toBeVisible()
    await expect(page.locator('h3').filter({ hasText: 'On Progress' })).toBeVisible()
    await expect(page.locator('h3').filter({ hasText: 'Done' })).toBeVisible()
  })

  test('should load tasks with English titles from DummyJSON API', async ({ page }) => {
    // Task cards exist - count them via their menu buttons
    const taskCount = await page.getByTestId('task-card-menu').count()
    expect(taskCount).toBeGreaterThan(0)

    // Get task card titles
    const cardTitles = page.locator('[role="button"] h3')
    const titleTexts = await cardTitles.allTextContents()
    expect(titleTexts.length).toBeGreaterThan(0)

    // Verify at least one task title is in English
    // DummyJSON returns titles like "Do something nice for someone you care about"
    const firstTitle = titleTexts[0]
    expect(firstTitle).toBeTruthy()
    expect(firstTitle).toMatch(/^[A-Za-z0-9\s.,!?'"()\-/&:;]+$/)
  })

  test('should switch between Kanban and List views', async ({ page }) => {
    // Default Kanban view
    await expect(page.getByRole('heading', { name: 'HR Tasks Hub' })).toBeVisible()

    // Switch to List view
    const listButton = page.locator('button').filter({ hasText: 'List' })
    await listButton.click()
    await page.waitForTimeout(500)

    // List view groups tasks by status - should show task names
    const taskNames = page.locator('p.font-semibold')
    await expect(taskNames.first()).toBeVisible({ timeout: 10000 })

    // Switch back to Kanban
    const kanbanButton = page.locator('button').filter({ hasText: 'Kanban' })
    await kanbanButton.click()
    await page.waitForTimeout(500)

    // Kanban columns should be visible again
    await expect(page.locator('h3').filter({ hasText: 'To-do' })).toBeVisible()
  })

  test('should filter tasks using search', async ({ page }) => {
    // Count initial task cards
    const initialCount = await page.getByTestId('task-card-menu').count()
    expect(initialCount).toBeGreaterThan(0)

    // Type a non-existent search term
    const searchInput = page.getByPlaceholder('Search here')
    await searchInput.fill('zzzzz_nonexistent_task')
    await page.waitForTimeout(500)

    // "No tasks" message should appear in at least one column
    const noTasksMessages = page.getByText('No tasks')
    await expect(noTasksMessages.first()).toBeVisible({ timeout: 5000 })

    // Clear search to restore tasks
    await searchInput.clear()
    await page.waitForTimeout(500)

    // Tasks should reappear
    const restoredCount = await page.getByTestId('task-card-menu').count()
    expect(restoredCount).toBeGreaterThan(0)
  })
})

test.describe('Task Management - Delete Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForTasksToLoad(page)
  })

  test('should show delete option in task card dropdown menu', async ({ page }) => {
    // Force-click the first task card menu button (opacity:0 by default)
    const menuButton = page.getByTestId('task-card-menu').first()
    await menuButton.click({ force: true })

    // Verify Edit and Delete menu items appear
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible()
  })

  test('should delete a task when confirmed', async ({ page }) => {
    // Intercept the refetch after deletion to return one fewer task
    // This is necessary because DummyJSON doesn't persist deletes
    let deletedTaskId: string | null = null

    // Intercept DELETE requests to track which task was deleted
    await page.route('**/todos/*', async (route) => {
      if (route.request().method() === 'DELETE') {
        const url = route.request().url()
        deletedTaskId = url.split('/todos/')[1]
        await route.continue()
      } else {
        await route.continue()
      }
    })

    // Count task cards before deletion
    const countBefore = await page.getByTestId('task-card-menu').count()
    expect(countBefore).toBeGreaterThan(0)

    // Get the first task title for verification
    const firstTaskTitle = await page.locator('[role="button"] h3').first().textContent()

    // Force-click the first task card menu button
    const menuButton = page.getByTestId('task-card-menu').first()
    await menuButton.click({ force: true })

    // Set up one-time dialog handler to accept the confirm dialog
    page.once('dialog', (dialog) => dialog.accept())

    // Click the Delete menu item
    await page.getByRole('menuitem', { name: 'Delete' }).click()

    // Verify a DELETE request was made
    await expect(async () => {
      expect(deletedTaskId).toBeTruthy()
    }).toPass({ timeout: 5000 })

    // Verify the success toast appears
    await expect(page.getByText('Task deleted successfully')).toBeVisible({ timeout: 5000 })
  })

  test('should not delete a task when cancelled', async ({ page }) => {
    // Count task cards before attempting deletion
    const countBefore = await page.getByTestId('task-card-menu').count()
    expect(countBefore).toBeGreaterThan(0)

    // Force-click the first task card menu button
    const menuButton = page.getByTestId('task-card-menu').first()
    await menuButton.click({ force: true })

    // Set up one-time dialog handler to dismiss (cancel)
    page.once('dialog', (dialog) => dialog.dismiss())

    // Click the Delete menu item
    await page.getByRole('menuitem', { name: 'Delete' }).click()

    // Wait briefly for any state changes
    await page.waitForTimeout(1000)

    // Task count should remain the same
    const countAfter = await page.getByTestId('task-card-menu').count()
    expect(countAfter).toBe(countBefore)
  })
})
