'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [meter, setMeter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    fetchMeter();
    const interval = setInterval(fetchMeter, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMeter = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setMeter(data[0]);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getValueColor = (value, type) => {
    if (type === 'voltage') {
      if (value < 220 || value > 250) return 'text-red-600 font-bold';
      if (value < 230 || value > 245) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'current') {
      if (value > 50) return 'text-red-600 font-bold';
      if (value > 40) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'frequency') {
      if (value < 49.5 || value > 50.5) return 'text-red-600 font-bold';
      return 'text-green-600';
    }
    return 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading energy meter data...</p>
        </div>
      </div>
    );
  }

  if (!meter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to fetch energy meter data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Energy Meter Monitor</title>
        <meta name="description" content="Real-time Energy Meter Monitoring" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Energy Meter Monitor
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time monitoring system - Slave ID: {meter.Slave}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(meter.status)} mr-2`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {meter.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">{lastUpdate}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Voltage Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Voltage Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              📊 Voltage Parameters
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ParameterCard 
                label="VR" 
                value={meter.VR} 
                unit="V" 
                color={getValueColor(meter.vr, 'voltage')}
              />
              <ParameterCard 
                label="VY" 
                value={meter.VY} 
                unit="V" 
                color={getValueColor(meter.vy, 'voltage')}
              />
              <ParameterCard 
                label="VB" 
                value={meter.VB} 
                unit="V" 
                color={getValueColor(meter.vb, 'voltage')}
              />
              <ParameterCard 
                label="VAR" 
                value={meter.VAR} 
                unit="VAR" 
                color="text-blue-600"
              />
              <ParameterCard 
                label="VAY" 
                value={meter.VAY} 
                unit="VAR" 
                color="text-blue-600"
              />
              <ParameterCard 
                label="VAB" 
                value={meter.VAB} 
                unit="VAR" 
                color="text-blue-600"
              />
            </div>
          </div>

          {/* Current Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              ⚡ Current Parameters
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ParameterCard 
                label="IR" 
                value={meter.IR} 
                unit="A" 
                color={getValueColor(meter.ir, 'current')}
              />
              <ParameterCard 
                label="IY" 
                value={meter.IY} 
                unit="A" 
                color={getValueColor(meter.iy, 'current')}
              />
              <ParameterCard 
                label="IB" 
                value={meter.IB} 
                unit="A" 
                color={getValueColor(meter.ib, 'current')}
              />
              <ParameterCard 
                label="EIB" 
                value={meter.EIB} 
                unit="kWh" 
                color="text-purple-600"
              />
              <ParameterCard 
                label="EEB" 
                value={meter.EEB} 
                unit="kWh" 
                color="text-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Power Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Power Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              🔋 Power Parameters
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ParameterCard 
                label="WR" 
                value={meter.WR} 
                unit="kW" 
                color="text-green-600"
              />
              <ParameterCard 
                label="WY" 
                value={meter.WY} 
                unit="kW" 
                color="text-green-600"
              />
              <ParameterCard 
                label="WB" 
                value={meter.WB} 
                unit="kW" 
                color="text-green-600"
              />
              <ParameterCard 
                label="VARR" 
                value={meter.VARR} 
                unit="VAR" 
                color="text-orange-600"
              />
              <ParameterCard 
                label="VARY" 
                value={meter.VARY} 
                unit="VAR" 
                color="text-orange-600"
              />
              <ParameterCard 
                label="VARB" 
                value={meter.VARB} 
                unit="VAR" 
                color="text-orange-600"
              />
            </div>
          </div>

          {/* System Parameters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              🎛️ System Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Frequency</div>
                <div className={`text-2xl font-bold ${getValueColor(meter.FRE, 'frequency')}`}>
                  {meter.FRE?.toFixed(2)} <span className="text-lg">Hz</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Slave ID</div>
                <div className="text-2xl font-bold text-gray-900">
                  {meter.Slave}
                </div>
              </div>
            </div>
            
            {/* Status Overview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {/* <h3 className="font-semibold text-gray-900 mb-3">System Status</h3> */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  {/* <span className="text-gray-600">Last Update:</span> */}
                  {/* <span className="font-medium">
                    {meter.last_updated ? new Date(meter.last_updated).toLocaleString() : 'N/A'}
                  </span> */}
                </div>
                <div className="flex justify-between">
                  {/* <span className="text-gray-600">System Status:</span> */}
                  <span className={`font-medium capitalize ${meter.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {meter.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard 
            title="Avg Voltage" 
            value={((meter.VR + meter.VY + meter.VB) / 3).toFixed(1)} 
            unit="V" 
            color="blue"
          />
          <StatCard 
            title="Avg Current" 
            value={((meter.IR + meter.IY + meter.IB) / 3).toFixed(2)} 
            unit="A" 
            color="green"
          />
          <StatCard 
            title="Total Power" 
            value={(meter.WR + meter.WY + meter.WB).toFixed(2)} 
            unit="kW" 
            color="purple"
          />
          <StatCard 
            title="Frequency" 
            value={meter.FRE?.toFixed(2)} 
            unit="Hz" 
            color="orange"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>Energy Monitoring System &copy; 2024</p>
            <p className="text-sm mt-1">Real-time single meter monitoring dashboard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Parameter Card Component
function ParameterCard({ label, value, unit, color = "text-gray-700" }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors duration-200">
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>
        {value !== null && value !== undefined ? value.toFixed(2) : 'N/A'} 
        <span className="text-sm font-normal ml-1">{unit}</span>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, unit, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
      <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
        {value} <span className="text-lg">{unit}</span>
      </div>
    </div>
  );
}