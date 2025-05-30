import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StrategyBuilder from './components/strategy/StrategyBuilder';
import Backtester from './components/backtest/Backtester';
import BacktestResults from './components/backtest/BacktestResults';
import Deployment from './components/deployment/Deployment';

function App() {
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route 
            path="/strategy/new" 
            element={<StrategyBuilder />} 
          />
          <Route 
            path="/strategy/:id" 
            element={<StrategyBuilder />} 
          />
          <Route 
            path="/backtest/:strategyId" 
            element={<Backtester />} 
          />
          <Route 
            path="/backtest/results/:jobId" 
            element={<BacktestResults />} 
          />
          <Route 
            path="/deployment/:strategyId" 
            element={<Deployment />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;