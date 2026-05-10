import { AppRouter } from './router'
import { ThemeProvider } from './theme'

export function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}
