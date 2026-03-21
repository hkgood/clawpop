import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from '../i18n/translations'

export type Page = 'welcome' | 'env' | 'config' | 'install' | 'success' | 'uninstall' | 'settings'
export type Theme = 'dark' | 'light'

export interface EnvCheckResult {
  node: string | null
  npm: string | null
  docker: string | null
  git: string | null
  network: boolean
}

export interface InstallProgress {
  step: string
  message: string
  progress: number
}

export interface InstallConfig {
  model: string
  apiKey: string
  channels: string[]
}

interface AppState {
  language: Language
  theme: Theme
  currentPage: Page
  envCheck: EnvCheckResult | null
  installConfig: InstallConfig
  installProgress: InstallProgress | null
  installError: string | null
  
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  setPage: (page: Page) => void
  setEnvCheck: (result: EnvCheckResult | null) => void
  setInstallConfig: (config: Partial<InstallConfig>) => void
  setInstallProgress: (progress: InstallProgress | null) => void
  setInstallError: (error: string | null) => void
  reset: () => void
}

const defaultInstallConfig: InstallConfig = {
  model: 'minimax-m2.5',
  apiKey: '',
  channels: [],
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'zh',
      theme: 'dark',
      currentPage: 'welcome',
      envCheck: null,
      installConfig: defaultInstallConfig,
      installProgress: null,
      installError: null,
      
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setPage: (page) => set({ currentPage: page }),
      setEnvCheck: (result) => set({ envCheck: result }),
      setInstallConfig: (config) => set((state) => ({
        installConfig: { ...state.installConfig, ...config }
      })),
      setInstallProgress: (progress) => set({ installProgress: progress }),
      setInstallError: (error) => set({ installError: error }),
      reset: () => set({
        currentPage: 'welcome',
        envCheck: null,
        installConfig: defaultInstallConfig,
        installProgress: null,
        installError: null,
      }),
    }),
    {
      name: 'clawpop-storage',
      partialize: (state) => ({ 
        // 只持久化配置、语言和主题
        installConfig: state.installConfig,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
)
