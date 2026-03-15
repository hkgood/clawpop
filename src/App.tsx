import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/layout/Sidebar'
import { Welcome } from './components/pages/Welcome'
import { EnvCheck } from './components/pages/EnvCheck'
import { Config } from './components/pages/Config'
import { Install } from './components/pages/Install'
import { Success } from './components/pages/Success'
import { useAppStore } from './stores/appStore'

function App() {
  const { currentPage } = useAppStore()
  
  const pageComponents = {
    welcome: <Welcome />,
    env: <EnvCheck />,
    config: <Config />,
    install: <Install />,
    success: <Success />,
  }
  
  return (
    <div className="h-screen w-screen flex bg-gradient-to-br from-bg-primary to-bg-dark overflow-hidden rounded-2xl">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {pageComponents[currentPage]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
