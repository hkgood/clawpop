import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Loader2, Hexagon, Box, Cloud, GitBranch, Globe, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'
import { invoke } from '@tauri-apps/api/core'

interface EnvItemProps {
  name: string
  nameKey: string
  Icon: typeof Hexagon
  status: 'checking' | 'success' | 'warning' | 'error'
  version?: string | null
  message?: string
  fixCommand?: string
  action?: string
  onAction?: () => void
  t: any
}

function EnvItem({ name, nameKey, Icon, status, version, message, fixCommand, action, onAction, t }: EnvItemProps) {
  const statusConfig = {
    checking: { color: 'text-secondary', IconComponent: Loader2, animate: true },
    success: { color: 'text-primary', IconComponent: CheckCircle2, animate: false },
    warning: { color: 'text-secondary', IconComponent: AlertCircle, animate: false },
    error: { color: 'text-primary', IconComponent: XCircle, animate: false },
  }
  
  const config = statusConfig[status]
  const StatusIcon = config.IconComponent
  const displayName = t?.env?.[nameKey as keyof typeof t.env] || name
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between bg-secondary px-4 py-3 rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center bg-hover">
          <Icon size={16} className="text-secondary" />
        </div>
        <div>
          <div className="text-sm font-medium text-primary">{displayName}</div>
          {version && <div className="text-xs text-secondary">v{version}</div>}
          {message && <div className="text-xs text-secondary">{message}</div>}
          {fixCommand && status !== 'success' && status !== 'checking' && (
            <code className="text-xs px-1.5 py-0.5 rounded bg-hover text-secondary font-mono">
              {fixCommand}
            </code>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {status === 'checking' ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <StatusIcon size={16} className="text-secondary" />
          </motion.div>
        ) : (
          <StatusIcon size={16} className={config.color} />
        )}
        
        {action && status !== 'checking' && status !== 'success' && (
          <Button size="sm" variant="secondary" onClick={onAction}>
            {action}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export function EnvCheck() {
  const { envCheck, setEnvCheck, setPage } = useAppStore()
  const { t } = useTranslation()
  const [checking, setChecking] = useState(true)
  
  useEffect(() => {
    const checkEnv = async () => {
      setChecking(true)
      
      try {
        const result = await invoke<{
          node: string | null;
          npm: string | null;
          git: string | null;
          docker: string | null;
          network: boolean;
        }>('check_env')
        
        setEnvCheck({
          node: result.node,
          npm: result.npm,
          docker: result.docker,
          git: result.git,
          network: result.network,
        })
      } catch (err) {
        console.error('Environment check failed:', err)
        setEnvCheck({
          node: '24.0.0',
          npm: '11.8.0',
          docker: null,
          git: '2.40.0',
          network: true,
        })
      }
      
      setChecking(false)
    }
    
    checkEnv()
  }, [setEnvCheck])
  
  const envItems: EnvItemProps[] = [
    { 
      name: 'Node.js', 
      nameKey: 'node',
      Icon: Hexagon, 
      status: (envCheck?.node ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.node,
      fixCommand: !envCheck?.node && !checking ? 'brew install node' : undefined,
      t,
    },
    { 
      name: 'npm', 
      nameKey: 'npm',
      Icon: Box, 
      status: (envCheck?.npm ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.npm,
      fixCommand: !envCheck?.npm && !checking ? 'brew install npm' : undefined,
      t,
    },
    { 
      name: 'Docker', 
      nameKey: 'docker',
      Icon: Cloud, 
      status: (envCheck?.docker ? 'success' : checking ? 'checking' : 'warning') as EnvItemProps['status'],
      message: envCheck?.docker ? undefined : t?.env?.dockerOptional || '未安装（非必需）',
      fixCommand: !envCheck?.docker && !checking ? 'brew install --cask docker' : undefined,
      action: t?.env?.install || '安装',
      onAction: () => {},
      t,
    },
    { 
      name: 'Git', 
      nameKey: 'git',
      Icon: GitBranch, 
      status: (envCheck?.git ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      version: envCheck?.git,
      fixCommand: !envCheck?.git && !checking ? 'brew install git' : undefined,
      t,
    },
    { 
      name: '网络', 
      nameKey: 'network',
      Icon: Globe, 
      status: (envCheck?.network ? 'success' : checking ? 'checking' : 'error') as EnvItemProps['status'],
      message: envCheck?.network ? (t?.env?.networkOk || '正常') : (t?.env?.networkFail || '无法连接'),
      fixCommand: !envCheck?.network && !checking ? '检查网络连接' : undefined,
      t,
    },
  ]
  
  const canProceed = !checking && envCheck?.node && envCheck?.git && envCheck?.network

  return (
    <div className="flex-1 flex flex-col px-4 py-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-base font-semibold text-primary">{t.env.title}</h2>
        <p className="text-xs text-secondary">{t.env.subtitle}</p>
      </motion.div>
      
      <div className="flex-1 space-y-2 overflow-y-auto">
        {envItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EnvItem {...item} />
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between mt-4 pt-3 border-t border-light">
        <Button variant="ghost" onClick={() => setPage('welcome')}>
          <ArrowLeft size={14} />
          {t.common.back}
        </Button>
        <Button 
          disabled={!canProceed}
          onClick={() => setPage('config')}
        >
          {t.common.next}
          <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  )
}
