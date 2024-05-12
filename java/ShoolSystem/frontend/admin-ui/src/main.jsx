import ReactDOM from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'

// to void or to solve duplicate api request, i need to dsiabled strictmode or remove it.
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
);