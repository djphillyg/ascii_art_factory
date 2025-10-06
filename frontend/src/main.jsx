import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { store } from './app/store'
import App from './app/App'
import './styles/main.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>,
)
