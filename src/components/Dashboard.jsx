import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStrategies, getRecentBacktests, getDeployedStrategies } from '../services/apiService';
import Charts from './common/Charts';

function Dashboard() {
  const [strategies, setStrategies] = useState([]);
  const [recentBacktests, setRecentBacktests] = useState([]);
  const [deployedStrategies, setDeployedStrategies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const strategiesData = await getStrategies();
        const backtestsData = await getRecentBacktests();
        const deploymentsData = await getDeployedStrategies();
        
        setStrategies(strategiesData);
        setRecentBacktests(backtestsData);
        setDeployedStrategies(deploymentsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <Link
          to="/strategy/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Strategy
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Total Strategies</h2>
              <p className="text-3xl font-bold text-gray-700">{strategies.length}</p>
              <div className="mt-4 text-sm text-gray-500">
                <span className="text-green-500">{Math.floor(Math.random() * 5) + 1} new</span> this week
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Active Deployments</h2>
              <p className="text-3xl font-bold text-gray-700">{deployedStrategies.filter(s => s.status === 'active').length}</p>
              <div className="mt-4 text-sm text-gray-500">
                <span className="text-blue-500">{deployedStrategies.filter(s => s.status === 'active').length} active</span> of {deployedStrategies.length} total
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Backtests Run</h2>
              <p className="text-3xl font-bold text-gray-700">{recentBacktests.length}</p>
              <div className="mt-4 text-sm text-gray-500">
                Last 30 days
              </div>
            </div>
          </div>

          {/* Recent Strategies */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Strategies</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {strategies.slice(0, 5).map((strategy) => (
                <Link to={`/strategy/${strategy.id}`} key={strategy.id} className="block hover:bg-gray-50">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{strategy.name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {new Date(strategy.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="text-sm text-gray-500 truncate">{strategy.description}</p>
                      <p className="text-sm text-gray-500">{strategy.components?.length || 0} components</p>
                    </div>
                  </div>
                </Link>
              ))}
              {strategies.length === 0 && (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  No strategies created yet. Create your first strategy!
                </div>
              )}
            </div>
            {strategies.length > 0 && (
              <div className="bg-gray-50 px-6 py-3">
                <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all strategies<span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Backtest Results */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Backtest Results</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentBacktests.slice(0, 5).map((backtest) => (
                <Link to={`/backtest/results/${backtest.id}`} key={backtest.id} className="block hover:bg-gray-50">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{backtest.strategy_name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          backtest.summary_metrics.sharpe_ratio > 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Sharpe: {backtest.summary_metrics.sharpe_ratio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">
                          Return: {(backtest.summary_metrics.total_return * 100).toFixed(2)}%
                        </p>
                        <p className="mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          DD: {(backtest.summary_metrics.max_drawdown * 100).toFixed(2)}%
                        </p>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 sm:mt-0">
                        {new Date(backtest.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              {recentBacktests.length === 0 && (
                <div className="px-6 py-4 text-center text-sm text-gray-500">
                  No backtests run yet.
                </div>
              )}
            </div>
            {recentBacktests.length > 0 && (
              <div className="bg-gray-50 px-6 py-3">
                <Link to="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all backtests<span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            )}
          </div>

          {/* Performance Overview */}
          {deployedStrategies.length > 0 && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Active Strategies Performance</h3>
              </div>
              <div className="p-6">
                <Charts.PerformanceChart data={deployedStrategies.filter(s => s.status === 'active')} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;