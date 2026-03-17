import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Page = 'welcome' | 'env' | 'config' | 'install' | 'success'

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
  currentPage: Page
  envCheck: EnvCheckResult | null
  installConfig: InstallConfig
  installProgress: InstallProgress | null
  installError: string | null
  
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
      currentPage: 'welcome',
      envCheck: null,
      installConfig: defaultInstallConfig,
      installProgress: null,
      installError: null,
      
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
        // 只持久化配置，不持久化安装进度
        installConfig: state.installConfig 
      }),
    }
  )
)
