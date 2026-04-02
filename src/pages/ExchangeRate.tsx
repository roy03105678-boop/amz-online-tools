import { useState } from 'react';
import { Banknote, RefreshCw } from 'lucide-react';

// Mock exchange rates (Base: CNY)
const RATES = {
  USD: { name: '美元 (USD)', rate: 7.25, symbol: '$' },
  EUR: { name: '欧元 (EUR)', rate: 7.85, symbol: '€' },
  GBP: { name: '英镑 (GBP)', rate: 9.15, symbol: '£' },
  JPY: { name: '日元 (JPY)', rate: 0.048, symbol: '¥' },
  CAD: { name: '加元 (CAD)', rate: 5.35, symbol: 'C$' },
};

export default function ExchangeRate() {
  const [amount, setAmount] = useState<number | ''>(100);
  const [currency, setCurrency] = useState<keyof typeof RATES>('USD');

  const currentRate = RATES[currency];
  const cnyAmount = amount === '' ? 0 : amount * currentRate.rate;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Banknote className="w-6 h-6 mr-2 text-green-600" />
            货币汇率参考
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            预估跨境收款金额。汇率每月更新，仅供参考，实际以收款平台为准。
          </p>
        </div>
        <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          <RefreshCw className="w-3 h-3 mr-1" />
          更新于: 2026-04-01
        </div>
      </div>

      <div className="max-w-2xl bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">外币金额</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{currentRate.symbol}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full pl-8 rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-lg border p-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">选择货币</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as keyof typeof RATES)}
                className="w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm border p-3"
              >
                {Object.entries(RATES).map(([code, data]) => (
                  <option key={code} value={code}>{data.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg border border-green-100 h-full">
            <p className="text-sm font-medium text-green-800 mb-2">折合人民币 (CNY)</p>
            <p className="text-4xl font-bold text-green-700">¥ {cnyAmount.toFixed(2)}</p>
            <p className="mt-4 text-xs text-green-600">
              当前参考汇率: 1 {currency} = {currentRate.rate.toFixed(4)} CNY
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
