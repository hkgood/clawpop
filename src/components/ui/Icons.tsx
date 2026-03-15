import { 
  Home, 
  Settings, 
  Zap, 
  Package, 
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

export const icons = {
  // 侧边栏
  home: Home,
  settings: Settings,
  zap: Zap,
  package: Package,
  sparkles: Sparkles,
  
  // 状态
  check: Check,
  x: X,
  alert: AlertCircle,
  loading: Loader2,
  
  // 导航
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  
  // 表单
  eye: Eye,
  eyeOff: EyeOff,
  
  // 操作
  externalLink: ExternalLink,
  refresh: RefreshCw,
}

export type IconName = keyof typeof icons
