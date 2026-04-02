import { useState, useMemo } from 'react';
import { Calculator, Info, Download } from 'lucide-react';

// Mock FBA Rates for demonstration (simplified)
const FBA_RATES = {
  US: {
    standard: { base: 3.22, perLb: 0.40 },
    oversize: { base: 8.26, perLb: 0.38 },
    storage: 0.87, // per cubic foot
  },
  UK: {
    standard: { base: 2.50, perLb: 0.30 },
    oversize: { base: 5.00, perLb: 0.25 },
    storage: 0.65,
  }
};

export default function FBACalculator() {
  const [site, setSite] = useState('US');
  const [category, setCategory] = useState('15'); // Referral fee %
  const [sizeTier, setSizeTier] = useState('standard');
  const [weight, setWeight] = useState(1);
  const [weightUnit, setWeightUnit] = useState('lb');
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(2);
  const [dimUnit, setDimUnit] = useState('in');
  
  const [productCost, setProductCost] = useState(5);
  const [shippingCost, setShippingCost] = useState(2);
  const [sellingPrice, setSellingPrice] = useState(25);
  const [fbmShipping, setFbmShipping] = useState(6);

  // Calculations
  const results = useMemo(() => {
    // Convert to lbs and inches for US calculation
    const weightInLbs = weightUnit === 'kg' ? weight * 2.20462 : weight;
    const lIn = dimUnit === 'cm' ? length * 0.393701 : length;
    const wIn = dimUnit === 'cm' ? width * 0.393701 : width;
    const hIn = dimUnit === 'cm' ? height * 0.393701 : height;
    
    const volumeCuIn = lIn * wIn * hIn;
    const volumeCuFt = volumeCuIn / 1728;
    
    // FBA Fees
    const rate = FBA_RATES[site as keyof typeof FBA_RATES] || FBA_RATES.US;
    const tierRate = rate[sizeTier as 'standard' | 'oversize'];
    
    const fulfillmentFee = tierRate.base + (Math.max(0, weightInLbs - 1) * tierRate.perLb);
    const referralFee = sellingPrice * (Number(category) / 100);
    const storageFee = volumeCuFt * rate.storage;
    
    const totalFBAFees = fulfillmentFee + referralFee + storageFee;
    const fbaProfit = sellingPrice - totalFBAFees - productCost - shippingCost;
    const fbaMargin = sellingPrice > 0 ? (fbaProfit / sellingPrice) * 100 : 0;

    // FBM
    const totalFBMFees = referralFee + fbmShipping;
    const fbmProfit = sellingPrice - totalFBMFees - productCost;
    const fbmMargin = sellingPrice > 0 ? (fbmProfit / sellingPrice) * 100 : 0;

    return {
      fulfillmentFee,
      referralFee,
      storageFee,
      totalFBAFees,
      fbaProfit,
      fbaMargin,
      fbmProfit,
      fbmMargin
    };
  }, [site, category, sizeTier, weight, weightUnit, length, width, height, dimUnit, productCost, shippingCost, sellingPrice, fbmShipping]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-blue-600" />
            FBA费用计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            快速计算FBA费用，对比FBA与自发货利润。数据仅供参考，以亚马逊后台实际收取为准。
          </p>
        </div>
        <button className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          导出结果
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">商品与站点信息</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">目标站点</label>
                <select 
                  value={site} onChange={(e) => setSite(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                >
                  <option value="US">美国 (US)</option>
                  <option value="UK">英国 (UK)</option>
                  {/* Add more sites */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品类目 (推荐费率)</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                >
                  <option value="15">大多数类目 (15%)</option>
                  <option value="8">电子产品 (8%)</option>
                  <option value="12">服装 (12%)</option>
                  <option value="20">珠宝首饰 (20%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">尺寸分段</label>
                <select 
                  value={sizeTier} onChange={(e) => setSizeTier(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                >
                  <option value="standard">标准尺寸 (Standard)</option>
                  <option value="oversize">大件 (Oversize)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  重量
                  <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="ml-2 text-xs border-none text-blue-600 bg-transparent cursor-pointer focus:ring-0">
                    <option value="lb">磅 (lb)</option>
                    <option value="kg">千克 (kg)</option>
                  </select>
                </label>
                <input 
                  type="number" min="0" step="0.01" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  尺寸 (长 x 宽 x 高)
                  <select value={dimUnit} onChange={(e) => setDimUnit(e.target.value)} className="ml-2 text-xs border-none text-blue-600 bg-transparent cursor-pointer focus:ring-0">
                    <option value="in">英寸 (in)</option>
                    <option value="cm">厘米 (cm)</option>
                  </select>
                </label>
                <div className="flex space-x-2">
                  <input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="长" />
                  <input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="宽" />
                  <input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="高" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">成本与售价</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">预期售价</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" min="0" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品成本 (单件)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" min="0" step="0.01" value={productCost} onChange={(e) => setProductCost(Number(e.target.value))}
                    className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">头程运费 (单件)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" min="0" step="0.01" value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自发货运费 (对比用)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input 
                    type="number" min="0" step="0.01" value={fbmShipping} onChange={(e) => setFbmShipping(Number(e.target.value))}
                    className="w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-5 py-4 border-b border-blue-100">
              <h3 className="text-lg font-medium text-blue-900">FBA 利润分析</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">净利润</span>
                <span className={`text-2xl font-bold ${results.fbaProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${results.fbaProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">利润率</span>
                <span className={`text-lg font-semibold ${results.fbaMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.fbaMargin.toFixed(2)}%
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">费用明细</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">亚马逊推荐费 ({category}%)</span>
                  <span className="text-gray-900">${results.referralFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">FBA 履约费</span>
                  <span className="text-gray-900">${results.fulfillmentFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">月度仓储费 (预估)</span>
                  <span className="text-gray-900">${results.storageFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-100">
                  <span className="text-gray-700">FBA总费用</span>
                  <span className="text-gray-900">${results.totalFBAFees.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">自发货 (FBM) 对比</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">净利润</span>
                <span className={`text-xl font-bold ${results.fbmProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${results.fbmProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">利润率</span>
                <span className={`text-md font-semibold ${results.fbmMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.fbmMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-md p-4 flex items-start">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              提示：此计算器采用简化模型。实际费用可能因旺季附加费、危险品处理费、超尺寸附加费等有所不同。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
