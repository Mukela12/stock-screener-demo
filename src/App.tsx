import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StockScreenerLayout from './layout/StockScreenerLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Screener from './pages/Screener'
import StockDetail from './pages/StockDetail'
import AIAssistant from './pages/AIAssistant'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/stock-screener/login" replace />} />
        <Route path="/stock-screener/login" element={<Login />} />
        <Route path="/stock-screener" element={<StockScreenerLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="screener" element={<Screener />} />
          <Route path="stock/:ticker" element={<StockDetail />} />
          <Route path="ai" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
