import { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';

export default function ACoSCalculator() {
  const [sellingPrice, setSellingPrice] = useState<number | ''>(29.99);
  const [productCost, setProductCost] = useState<number | ''>(5.00);
  const [fbaFee, setFbaFee] = useState<number | ''>(4.50);
  const [referralFee, setReferralFee] = useState<number | ''>(4.50); // 15% usually
  const [miscCost, setMiscCost] = useState<number | ''>(1.00);

  const results = useMemo(() => {
    if (sellingPrice === '' || productCost === '' || fbaFee === '' || referralFee === '' || miscCost === '') {
      return null;
    }

    const totalCosts = productCost + fbaFee + referralFee + miscCost;
    const profitBeforeAds = sellingPrice - totalCosts;
    const profitMargin = (profitBeforeAds / sellingPrice) * 100;
    
    // Breakeven ACoS is exactly the profit margin before ads
    const breakevenACoS = profitMargin;
    const breakevenRoAS = breakevenACoS > 0 ? (100 / breakevenACoS) : 0;

    return {
      profitBeforeAds,
      breakevenACoS,
      breakevenRoAS
    };
  }, [sellingPrice, productCost, fbaFee, referralFee, miscCost]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-emerald-600" />
            盈亏平衡 ACoS 计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            计算广告花费底线，明确 ACoS 阈值，避免广告亏损。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">输入产品数据</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">产品售价 ($)</label>
            <input type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2.5" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">采购+头程成本 ($)</label>
              <input type="number" min="0" step="0.01" value={productCost} onChange={(e) => setProductCost(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FBA 履约费 ($)</label>
              <input type="number" min="0" step="0.01" value={fbaFee} onChange={(e) => setFbaFee(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">平台佣金 ($)</label>
              <input type="number" min="0" step="0.01" value={referralFee} onChange={(e) => setReferralFee(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">其他杂费 ($)</label>
              <input type="number" min="0" step="0.01" value={miscCost} onChange={(e) => setMiscCost(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm border p-2.5" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-6">计算结果</h3>
          
          {results ? (
            <div className="flex-1 flex flex-col space-y-6">
              <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100 text-center">
                <p className="text-sm font-medium text-emerald-800 mb-2">盈亏平衡 ACoS (Breakeven ACoS)</p>
                <p className={`text-5xl font-bold ${results.breakevenACoS > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {results.breakevenACoS.toFixed(2)}%
                </p>
                <p className="mt-2 text-xs text-emerald-700">
                  当广告 ACoS 低于此数值时，您的产品开始盈利。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">盈亏平衡 RoAS</p>
                  <p className="text-xl font-bold text-gray-900">
                    {results.breakevenRoAS > 0 ? results.breakevenRoAS.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">广告前单件利润</p>
                  <p className={`text-xl font-bold ${results.profitBeforeAds > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${results.profitBeforeAds.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              请输入完整数据以获取计算结果
            </div>
          )}

          <div className="mt-6 bg-gray-50 rounded-md p-4 flex items-start">
            <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <strong>什么是盈亏平衡 ACoS？</strong><br/>
              它是指您的利润率（扣除所有成本后）。如果您的利润率是 30%，那么当广告 ACoS 刚好为 30% 时，您不赚不亏。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
