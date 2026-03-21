export type Language = 'zh' | 'en'

export interface Translations {
  // Welcome
  welcome: {
    title: string
    subtitle: string
    slogan: string
    button: string
    uninstall: string
  }
  // EnvCheck
  env: {
    title: string
    subtitle: string
    checking: string
    node: string
    npm: string
    docker: string
    git: string
    network: string
    networkOk: string
    networkFail: string
    dockerOptional: string
    install: string
    fixCommand: string
  }
  // Config
  config: {
    title: string
    subtitle: string
    modelSelect: string
    apiKey: string
    apiKeyPlaceholder: string
    apiKeyValid: string
    apiKeyInvalid: string
    getApiKey: string
    channels: string
    proceed: string
    back: string
    next: string
  }
  // Install
  install: {
    title: string
    titleDone: string
    subtitle: string
    stepCheck: string
    stepClone: string
    stepDeps: string
    stepConfig: string
    stepService: string
    stepStart: string
    copyLogs: string
    copied: string
    error: string
    retry: string
  }
  // Success
  success: {
    title: string
    subtitle: string
    consoleUrl: string
    nextStep: string
    startCmd: string
    openConsole: string
    reinstall: string
    docs: string
  }
  // Uninstall
  uninstall: {
    title: string
    subtitle: string
    notInstalled: string
    selectUninstall: string
    uninstallOpenclaw: string
    uninstallDeps: string
    uninstallConfig: string
    uninstallData: string
    uninstallAll: string
    uninstalling: string
    uninstallDone: string
    back: string
    confirm: string
    cancel: string
    warning: string
  }
  // Common
  common: {
    back: string
    next: string
    confirm: string
    cancel: string
    yes: string
    no: string
    loading: string
    error: string
    success: string
  }
}

export const translations: Record<Language, Translations> = {
  zh: {
    welcome: {
      title: 'clawpop',
      subtitle: '让安装 OpenClaw 变得像打开 App 一样简单',
      slogan: '「啪嗒一下，装好了」',
      button: '开始使用',
      uninstall: '卸载 OpenClaw',
    },
    env: {
      title: '环境检测',
      subtitle: '让我们检查一下你的电脑环境',
      checking: '检测中...',
      node: 'Node.js',
      npm: 'npm',
      docker: 'Docker',
      git: 'Git',
      network: '网络',
      networkOk: '正常',
      networkFail: '无法连接',
      dockerOptional: '未安装（非必需）',
      install: '安装',
      fixCommand: '安装命令',
    },
    config: {
      title: '配置向导',
      subtitle: '选择你的 AI 模型和消息通道',
      modelSelect: '选择模型',
      apiKey: 'API Key',
      apiKeyPlaceholder: '输入你的 API Key',
      apiKeyValid: '格式正确',
      apiKeyInvalid: '格式错误',
      getApiKey: '获取 API Key',
      channels: '消息通道',
      proceed: '请选择模型并输入 API Key',
      back: '上一步',
      next: '下一步',
    },
    install: {
      title: '安装中',
      titleDone: '安装完成',
      subtitle: '正在安装 OpenClaw...',
      stepCheck: '检查环境',
      stepClone: '克隆仓库',
      stepDeps: '安装依赖',
      stepConfig: '初始化配置',
      stepService: '安装服务',
      stepStart: '启动服务',
      copyLogs: '复制日志',
      copied: '已复制',
      error: '安装失败',
      retry: '重试',
    },
    success: {
      title: '安装成功!',
      subtitle: 'OpenClaw 已经装好了，随时可以使用',
      consoleUrl: '控制台地址',
      nextStep: '下一步',
      startCmd: '/start',
      openConsole: '打开控制台',
      reinstall: '重新安装',
      docs: 'OpenClaw 文档',
    },
    uninstall: {
      title: '卸载 OpenClaw',
      subtitle: '选择要删除的内容',
      notInstalled: '未检测到 OpenClaw 安装',
      selectUninstall: '选择卸载选项',
      uninstallOpenclaw: 'OpenClaw 主程序',
      uninstallDeps: 'Node.js 依赖',
      uninstallConfig: '配置文件',
      uninstallData: '工作数据',
      uninstallAll: '完全卸载（包含以上全部）',
      uninstalling: '正在卸载...',
      uninstallDone: '卸载完成',
      back: '返回',
      confirm: '确认卸载',
      cancel: '取消',
      warning: '此操作不可恢复',
    },
    common: {
      back: '上一步',
      next: '下一步',
      confirm: '确认',
      cancel: '取消',
      yes: '是',
      no: '否',
      loading: '加载中...',
      error: '错误',
      success: '成功',
    },
  },
  en: {
    welcome: {
      title: 'clawpop',
      subtitle: 'Install OpenClaw as easily as opening an App',
      slogan: '"Snap! It\'s installed"',
      button: 'Get Started',
      uninstall: 'Uninstall OpenClaw',
    },
    env: {
      title: 'Environment Check',
      subtitle: 'Let\'s check your system',
      checking: 'Checking...',
      node: 'Node.js',
      npm: 'npm',
      docker: 'Docker',
      git: 'Git',
      network: 'Network',
      networkOk: 'OK',
      networkFail: 'Cannot connect',
      dockerOptional: 'Not installed (optional)',
      install: 'Install',
      fixCommand: 'Install command',
    },
    config: {
      title: 'Configuration',
      subtitle: 'Choose your AI model and messaging channels',
      modelSelect: 'Select Model',
      apiKey: 'API Key',
      apiKeyPlaceholder: 'Enter your API Key',
      apiKeyValid: 'Valid format',
      apiKeyInvalid: 'Invalid format',
      getApiKey: 'Get API Key',
      channels: 'Messaging Channels',
      proceed: 'Please select a model and enter API Key',
      back: 'Back',
      next: 'Next',
    },
    install: {
      title: 'Installing',
      titleDone: 'Installation Complete',
      subtitle: 'Installing OpenClaw...',
      stepCheck: 'Check Environment',
      stepClone: 'Clone Repository',
      stepDeps: 'Install Dependencies',
      stepConfig: 'Initialize Config',
      stepService: 'Install Service',
      stepStart: 'Start Service',
      copyLogs: 'Copy Logs',
      copied: 'Copied',
      error: 'Installation Failed',
      retry: 'Retry',
    },
    success: {
      title: 'Installation Complete!',
      subtitle: 'OpenClaw is installed and ready to use',
      consoleUrl: 'Console URL',
      nextStep: 'Next Step',
      startCmd: '/start',
      openConsole: 'Open Console',
      reinstall: 'Reinstall',
      docs: 'OpenClaw Docs',
    },
    uninstall: {
      title: 'Uninstall OpenClaw',
      subtitle: 'Select what to remove',
      notInstalled: 'OpenClaw not detected',
      selectUninstall: 'Select uninstall options',
      uninstallOpenclaw: 'OpenClaw Core',
      uninstallDeps: 'Node.js Dependencies',
      uninstallConfig: 'Configuration Files',
      uninstallData: 'Working Data',
      uninstallAll: 'Full Uninstall (all above)',
      uninstalling: 'Uninstalling...',
      uninstallDone: 'Uninstall Complete',
      back: 'Back',
      confirm: 'Confirm Uninstall',
      cancel: 'Cancel',
      warning: 'This action cannot be undone',
    },
    common: {
      back: 'Back',
      next: 'Next',
      confirm: 'Confirm',
      cancel: 'Cancel',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
  },
}
