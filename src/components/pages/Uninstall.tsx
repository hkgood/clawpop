import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Package, FileCog, FolderOpen, AlertTriangle, Check, X, ArrowLeft, Loader2, AlertOctagon } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAppStore } from '../../stores/appStore'
import { useTranslation } from '../../i18n/useTranslation'

interface UninstallOption {
  id: string
  label: string
  description: string
  icon: typeof Package
  checked: boolean
}

export function Uninstall() {
  const { t } = useTranslation()
  const { setPage } = useAppStore()
  const [isInstalled] = useState<boolean | null>(null)
  const [isUninstalling, setIsUninstalling] = useState(false)
  const [uninstallComplete, setUninstallComplete] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [options, setOptions] = useState<UninstallOption[]>([
    { 
      id: 'openclaw', 
      label: t.uninstall.uninstallOpenclaw, 
      description: '删除 OpenClaw 主程序和 CLI',
      icon: Package,
      checked: true 
    },
    { 
      id: 'deps', 
      label: t.uninstall.uninstallDeps, 
      description: '删除 node_modules 和 npm 包',
      icon: Trash2,
      checked: false 
    },
    { 
      id: 'config', 
      label: t.uninstall.uninstallConfig, 
      description: '删除配置文件 (~/.openclaw)',
      icon: FileCog,
      checked: true 
    },
    { 
      id: 'data', 
      label: t.uninstall.uninstallData, 
      description: '删除工作数据和工作空间',
      icon: FolderOpen,
      checked: false 
    },
  ])

  const toggleOption = (id: string) => {
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, checked: !opt.checked } : opt
    ))
  }

  const selectAll = () => {
    setOptions(prev => prev.map(opt => ({ ...opt, checked: true })))
  }

  const handleUninstall = () => {
    setShowConfirm(true)
  }

  const confirmUninstall = async () => {
    setIsUninstalling(true)
    try {
      const { invoke } = await import('@tauri-apps/api/core')
      const selected = options.filter(o => o.checked).map(o => o.id)
      await invoke('uninstall', { options: selected })
      setUninstallComplete(true)
    } catch (err) {
      console.error('Uninstall failed:', err)
    } finally {
      setIsUninstalling(false)
      setShowConfirm(false)
    }
  }

  const selectedCount = options.filter(o => o.checked).length

  // 卸载完成
  if (uninstallComplete) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6"
        >
          <Check size={40} className="text-success" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2 text-primary"
        >
          {t.uninstall.uninstallDone}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-secondary mb-8"
        >
          OpenClaw 已从你的电脑中移除
        </motion.p>
        
        <Button onClick={() => setPage('welcome')}>
          {t.uninstall.back}
        </Button>
      </div>
    )
  }

  // 未安装
  if (isInstalled === false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-hover flex items-center justify-center mb-6"
        >
          <X size={40} className="text-secondary" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-2 text-primary"
        >
          {t.uninstall.notInstalled}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-secondary mb-8"
        >
          你的电脑上未检测到 OpenClaw
        </motion.p>
        
        <Button onClick={() => setPage('welcome')}>
          {t.uninstall.back}
        </Button>
      </div>
    )
  }

  // 卸载选项
  return (
    <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2 text-primary">{t.uninstall.title}</h2>
        <p className="text-secondary mb-2">{t.uninstall.subtitle}</p>
        
        <div className="flex items-center gap-2 text-warning text-sm mt-4">
          <AlertTriangle size={16} />
          <span>{t.uninstall.warning}</span>
        </div>
      </motion.div>
      
      <div className="flex-1 space-y-3 mt-6">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => toggleOption(option.id)}
            className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
              option.checked
                ? 'bg-accent border-2 border-accent'
                : 'bg-hover border-2 border-transparent hover:border-default'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              option.checked ? 'bg-brand-30' : 'bg-hover'
            }`}>
              <option.icon size={20} className={option.checked ? 'text-accent' : 'text-secondary'} />
            </div>
            
            <div className="flex-1">
              <div className="font-medium text-primary">{option.label}</div>
              <div className="text-sm text-secondary">{option.description}</div>
            </div>
            
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
              option.checked 
                ? 'border-btn-primary bg-btn-primary' 
                : 'border-default'
            }`}>
              {option.checked && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check size={14} className="text-btn-primary" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-between mt-6 pt-4 border-t border-light">
        <Button variant="ghost" onClick={() => setPage('welcome')}>
          <ArrowLeft size={16} />
          {t.uninstall.back}
        </Button>
        
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={selectAll}
            disabled={isUninstalling}
          >
            全选
          </Button>
          <Button 
            onClick={handleUninstall}
            disabled={selectedCount === 0 || isUninstalling}
          >
            {isUninstalling ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.uninstall.uninstalling}
              </>
            ) : (
              <>
                <Trash2 size={16} />
                {t.uninstall.confirm} ({selectedCount})
              </>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-bg-secondary rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center">
                  <AlertOctagon size={24} className="text-error" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-primary">确认卸载</h3>
                  <p className="text-secondary text-sm">{t.uninstall.warning}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                {options.filter(o => o.checked).map(o => (
                  <div key={o.id} className="flex items-center gap-2 text-sm text-primary">
                    <Check size={14} className="text-success" />
                    <span>{o.label}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowConfirm(false)}
                >
                  {t.uninstall.cancel}
                </Button>
                <Button 
                  className="flex-1 bg-error hover:bg-error/80"
                  onClick={confirmUninstall}
                >
                  {t.uninstall.confirm}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
