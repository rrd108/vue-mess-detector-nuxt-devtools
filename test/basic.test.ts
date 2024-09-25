import { describe, it, expect, vi } from 'vitest'
import { addCustomTab } from '@nuxt/devtools-kit'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
import { analyze } from 'vue-mess-detector'
import { setupDevToolsUI } from '../src/devtools'

vi.mock('@nuxt/devtools-kit', () => ({
  addCustomTab: vi.fn(),
}))

vi.mock('vue-mess-detector', () => ({
  analyze: vi.fn(),
  FLAT_RULES: {},
}))

describe('setupDevToolsUI', () => {
  it('calls addCustomTab with correct parameters', () => {
    const mockNuxt = {
      hook: vi.fn(),
    } as unknown as Nuxt
    const mockResolver = {
      resolve: vi.fn().mockReturnValue('./client'),
    } as unknown as Resolver

    // Call the function
    setupDevToolsUI(mockNuxt, mockResolver)

    // Check if addCustomTab was called with the correct parameters
    expect(addCustomTab).toHaveBeenCalledWith({
      name: 'vue-mess-detector',
      title: 'Vue Mess Detector',
      icon: 'tabler:analyze',
      view: {
        type: 'iframe',
        src: '/__vue-mess-detector',
      },
    })
  })
})
