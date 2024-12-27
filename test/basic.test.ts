import { describe, it, expect, vi } from 'vitest'
import { addCustomTab } from '@nuxt/devtools-kit'
import type { Nuxt } from '@nuxt/schema'
import type { Resolver } from '@nuxt/kit'
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

    setupDevToolsUI(mockNuxt, mockResolver)

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

  it('sets up production middleware when client path exists', () => {
    vi.mock('node:fs', () => ({
      existsSync: () => true,
    }))

    const mockNuxt = {
      hook: vi.fn(),
    } as unknown as Nuxt
    const mockResolver = {
      resolve: vi.fn().mockReturnValue('./client'),
    } as unknown as Resolver

    setupDevToolsUI(mockNuxt, mockResolver)

    expect(mockNuxt.hook).toHaveBeenCalledWith('vite:extendConfig', expect.any(Function))
  })

  it('sets up development proxy when client path does not exist', () => {
    vi.mock('node:fs', () => ({
      existsSync: () => false,
    }))

    const mockNuxt = {
      hook: vi.fn(),
    } as unknown as Nuxt
    const mockResolver = {
      resolve: vi.fn().mockReturnValue('./client'),
    } as unknown as Resolver

    setupDevToolsUI(mockNuxt, mockResolver)

    expect(mockNuxt.hook).toHaveBeenCalledWith('vite:extendConfig', expect.any(Function))
  })
})
