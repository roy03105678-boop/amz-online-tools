import { useState, useMemo } from 'react';
import { DollarSign, Download, ArrowRightLeft } from 'lucide-react';

export default function PricingCalculator() {
  const [mode, setMode] = useState<'forward' | 'backward'>('forward');
  
  // Inputs
  const [productCost, setProductCost] = useState(5);
  const [shippingCost, setShippingCost] = useState(2);
  const [fbaFee, setFbaFee] = useState(4.5);
  const [referralPercent, setReferralPercent] = useState(15);
  const [miscCost, setMiscCost] = useState(1);
  
  // Forward Pricing
  const [targetMargin, setTargetMargin] = useState(30);
  
  // Backward Pricing
  const [targetPrice, setTargetPrice] = useState(29.99);

  const results = useMemo(() => {
    const fixedCosts = productCost + shippingCost + fbaFee + miscCost;
    const referralDecimal = referralPercent / 100;
    
    if (mode === 'forward') {
      // Price = FixedCosts / (1 - ReferralRate - TargetMarginRate)
      const marginDecimal = targetMargin / 100;
      const divisor = 1 - referralDecimal - marginDecimal;
      
      let suggestedPrice = 0;
      let actualMargin = 0;
      let referralFee = 0;
      let profit = 0;

      if (divisor > 0) {
        suggestedPrice = fixedCosts / divisor;
        referralFee = suggestedPrice * referralDecimal;
        profit = suggestedPrice - fixedCosts - referralFee;
        actualMargin = targetMargin;
      }

      return {
        price: suggestedPrice,
        profit,
        margin: actualMargin,
        referralFee,
        fixedCosts
      };
    } else {
      // Profit = Price - FixedCosts - (Price * ReferralRate)
      const referralFee = targetPrice * referralDecimal;
      const profit = targetPrice - fixedCosts - referralFee;
      const margin = targetPrice > 0 ? (profit / targetPrice) * 100 : 0;

      return {
        price: targetPrice,
        profit,
        margin,
        referralFee,
        fixedCosts
      };
    }
  }, [mode, productCost, shippingCost, fbaFee, referralPercent, miscCost, targetMargin, targetPrice]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            定价计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            正向推算目标售价，或反向计算当前售价的实际利润率。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-1">
        <div className="flex">
          <button
            onClick={() => setMode('forward')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md text-center transition-colors ${
              mode === 'forward' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            正向定价 (按目标利润算售价)
          </button>
          <button
            onClick={() => setMode('backward')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-md text-center transition-colors ${
              mode === 'backward' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            反向定价 (按售价算实际利润)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">成本信息</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品采购成本</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" min="0" step="0.01" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))} className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">头程运费 (单件)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" min="0" step="0.01" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FBA 履约费</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" min="0" step="0.01" value={fbaFee} onChange={(e) => setFbaFee(Number(e.target.value))} className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">其他杂费 (包装/贴标等)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" min="0" step="0.01" value={miscCost} onChange={(e) => setMiscCost(Number(e.target.value))} className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">亚马逊推荐费比例 (%)</label>
                <input type="number" min="0" max="100" step="1" value={referralPercent} onChange={(e) => setReferralPercent(Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {mode === 'forward' ? '目标设定' : '售价设定'}
            </h3>
            {mode === 'forward' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目标利润率 (%)</label>
                <input type="number" min="0" max="99" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                <p className="mt-2 text-xs text-gray-500">建议卖家目标利润率设定在 25% - 35% 之间。</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预期售价</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="number" min="0" step="0.01" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 px-5 py-4 border-b border-green-100">
              <h3 className="text-lg font-medium text-green-900">计算结果</h3>
            </div>
            <div className="p-5 space-y-6">
              {mode === 'forward' ? (
                <div className="text-center pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">建议最低售价</p>
                  {results.price > 0 ? (
                    <p className="text-4xl font-bold text-gray-900">${results.price.toFixed(2)}</p>
                  ) : (
                    <p className="text-sm text-red-500">目标利润率过高，无法计算</p>
                  )}
                </div>
              ) : (
                <div className="text-center pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">实际利润率</p>
                  <p className={`text-4xl font-bold ${results.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.margin.toFixed(2)}%
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">单件净利润</span>
                  <span className={`font-medium ${results.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">固定成本总计</span>
                  <span className="text-gray-900">${results.fixedCosts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">平台推荐费 ({referralPercent}%)</span>
                  <span className="text-gray-900">${results.referralFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
