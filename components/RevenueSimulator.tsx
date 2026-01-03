import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { SimulationParams, RevenueData } from '../types';
import { DollarSign, Users, Activity, TrendingUp, Download } from 'lucide-react';

const RevenueSimulator: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    acquisitionRate: 500,
    churnRate: 5,
    conversionRate: 3,
    arpu: 9.99,
    initialUsers: 0,
    months: 24
  });

  const data = useMemo<RevenueData[]>(() => {
    const result: RevenueData[] = [];
    let currentFreeUsers = params.initialUsers;
    let currentPaidUsers = 0;

    for (let i = 1; i <= params.months; i++) {
      // New users come in
      const newUsers = params.acquisitionRate;
      
      // Some convert to paid
      const newPaid = (currentFreeUsers + newUsers) * (params.conversionRate / 100);
      
      // Update totals before churn
      let totalFree = currentFreeUsers + newUsers - newPaid;
      let totalPaid = currentPaidUsers + newPaid;

      // Apply churn
      // Simple churn model: Free users churn less often in this model, focusing on paid churn
      const paidChurn = totalPaid * (params.churnRate / 100);
      totalPaid -= paidChurn;
      
      // Free users leaving (simplified 10% base churn for free tier usually)
      const freeChurn = totalFree * 0.10; 
      totalFree -= freeChurn;

      currentFreeUsers = totalFree;
      currentPaidUsers = totalPaid;

      // Calculate revenue
      const monthlyRevenue = totalPaid * params.arpu;

      // Simple expense model: Fixed server cost + scaling cost
      const expenses = 50 + ((totalFree + totalPaid) * 0.05); 

      result.push({
        month: i,
        revenue: Math.round(monthlyRevenue),
        users: Math.round(totalPaid + totalFree),
        expenses: Math.round(expenses)
      });
    }
    return result;
  }, [params]);

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = totalRevenue - data.reduce((acc, curr) => acc + curr.expenses, 0);

  const handleParamChange = (key: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const downloadCSV = () => {
    const headers = ['Month', 'Revenue ($)', 'Total Users', 'Expenses ($)', 'Profit ($)'];
    const rows = data.map(row => [
      row.month,
      row.revenue,
      row.users,
      row.expenses,
      row.revenue - row.expenses
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'monetizeai_simulation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-700 pb-4 gap-4">
         <div>
          <h2 className="text-2xl font-bold text-white">SaaS Revenue Simulator</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
            This interactive tool helps you visualize the financial future of your subscription app.
            By tweaking variables like <strong>User Acquisition</strong> (how many people join), <strong>Conversion Rate</strong> (how many pay), 
            and <strong>Churn</strong> (how many leave), you can see the compound effect on your 
            Monthly Recurring Revenue (MRR) and total user base over 24 months.
          </p>
         </div>
         <div className="flex flex-col items-end gap-3">
           <div className="text-right min-w-[150px]">
             <div className="text-sm text-slate-400">2 Year Total Revenue</div>
             <div className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</div>
           </div>
           <button 
             onClick={downloadCSV}
             className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 px-4 py-2 rounded-lg border border-slate-700 transition-all text-sm font-medium shadow-sm hover:shadow-cyan-900/20"
           >
             <Download className="w-4 h-4" />
             Export CSV
           </button>
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
         
         {/* Controls */}
         <div className="lg:col-span-1 space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-fit">
            <h3 className="font-semibold text-cyan-400 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Model Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">New Users / Month</span>
                  <span className="text-cyan-400 font-mono">{params.acquisitionRate}</span>
                </label>
                <input 
                  type="range" min="0" max="5000" step="50" 
                  value={params.acquisitionRate}
                  onChange={(e) => handleParamChange('acquisitionRate', Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-1">Organic traffic + Paid ads visitors</p>
              </div>

              <div>
                <label className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Conversion Rate (%)</span>
                  <span className="text-cyan-400 font-mono">{params.conversionRate}%</span>
                </label>
                <input 
                  type="range" min="0.1" max="20" step="0.1" 
                  value={params.conversionRate}
                  onChange={(e) => handleParamChange('conversionRate', Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                 <p className="text-xs text-slate-500 mt-1">Percent of free users who upgrade</p>
              </div>

              <div>
                <label className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Monthly Price ($)</span>
                  <span className="text-cyan-400 font-mono">${params.arpu}</span>
                </label>
                <input 
                  type="range" min="1" max="100" step="1" 
                  value={params.arpu}
                  onChange={(e) => handleParamChange('arpu', Number(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

               <div>
                <label className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Churn Rate (%)</span>
                  <span className="text-red-400 font-mono">{params.churnRate}%</span>
                </label>
                <input 
                  type="range" min="0" max="20" step="0.5" 
                  value={params.churnRate}
                  onChange={(e) => handleParamChange('churnRate', Number(e.target.value))}
                  className="w-full accent-red-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                 <p className="text-xs text-slate-500 mt-1">Percent of subscribers cancelling/month</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700 mt-4">
               <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                 <span>Est. Profit Margin</span>
                 <span className={`${(totalProfit/totalRevenue) > 0.5 ? 'text-green-400' : 'text-yellow-400'}`}>
                   {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%
                 </span>
               </div>
               <div className="text-xs text-slate-500">
                 *Simplified model assuming linear growth and fixed server costs.
               </div>
            </div>
         </div>

         {/* Charts */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-[300px]">
              <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Monthly Revenue & Expenses
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#e2e8f0' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExp)" name="Expenses ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-[250px]">
              <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" /> Total User Base Growth
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} dot={false} name="Total Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </div>

       </div>
    </div>
  );
};

export default RevenueSimulator;