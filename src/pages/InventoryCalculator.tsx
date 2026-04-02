import { useState, useMemo } from 'react';
import { Package, AlertCircle } from 'lucide-react';

export default function InventoryCalculator() {
  const [dailySales, setDailySales] = useState(20);
  const [currentInventory, setCurrentInventory] = useState(500);
  const [safetyDays, setSafetyDays] = useState(14);
  const [leadTime, setLeadTime] = useState(30); // 备货+运输时间
  const [lossRate, setLossRate] = useState(0.5); // 损耗率 %

  const results = useMemo(() => {
    // 每日消耗量
    const dailyConsumption = dailySales;
    
    // 安全库存量
    const safetyStock = dailyConsumption * safetyDays;
    
    // 补货周期内消耗量
    const leadTimeConsumption = dailyConsumption * leadTime;
    
    // 建议补货点 (Reorder Point) = 补货周期内消耗量 + 安全库存量
    const reorderPoint = leadTimeConsumption + safetyStock;
    
    // 建议补货量 (考虑损耗)
    // 假设目标是补足到一个周期的销量 + 安全库存
    // 这里简单计算为：(补货周期消耗 + 安全库存) * (1 + 损耗率)
    // 实际补货量可能还需要减去当前库存，但这取决于补货策略
    const suggestedOrderQuantity = Math.ceil((leadTimeConsumption + safetyStock) * (1 + lossRate / 100));
    
    // 预计断货天数
    const daysUntilStockout = Math.floor(currentInventory / dailyConsumption);
    
    // 是否需要立即补货
    const needsReorder = currentInventory <= reorderPoint;

    return {
      safetyStock,
      reorderPoint,
      suggestedOrderQuantity,
      daysUntilStockout,
      needsReorder
    };
  }, [dailySales, currentInventory, safetyDays, leadTime, lossRate]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="w-6 h-6 mr-2 text-orange-600" />
            库存补货计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            合理规划库存，计算建议补货量与补货时间，避免断货。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">基础参数</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日均销量 (件)</label>
                <input 
                  type="number" min="0" value={dailySales} onChange={(e) => setDailySales(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前可用库存 (件)</label>
                <input 
                  type="number" min="0" value={currentInventory} onChange={(e) => setCurrentInventory(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">安全库存天数</label>
                <input 
                  type="number" min="0" value={safetyDays} onChange={(e) => setSafetyDays(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                />
                <p className="mt-1 text-xs text-gray-500">建议设置 7-14 天以应对突发情况。</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">运输参数</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">补货周期 (天)</label>
                <input 
                  type="number" min="0" value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                />
                <p className="mt-1 text-xs text-gray-500">包含工厂生产 + 头程运输 + 亚马逊上架时间。</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">运输损耗率 (%)</label>
                <input 
                  type="number" min="0" step="0.1" value={lossRate} onChange={(e) => setLossRate(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-orange-50 px-5 py-4 border-b border-orange-100">
              <h3 className="text-lg font-medium text-orange-900">计算结果</h3>
            </div>
            <div className="p-5 space-y-6">
              <div className="text-center pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">建议单次补货量</p>
                <p className="text-4xl font-bold text-gray-900">{results.suggestedOrderQuantity} <span className="text-lg font-normal text-gray-500">件</span></p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">当前可售天数</span>
                  <span className={`font-medium ${results.daysUntilStockout <= results.leadTime ? 'text-red-600' : 'text-green-600'}`}>
                    约 {results.daysUntilStockout} 天
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">补货预警线 (Reorder Point)</span>
                  <span className="font-medium text-gray-900">{results.reorderPoint} 件</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">安全库存量</span>
                  <span className="font-medium text-gray-900">{results.safetyStock} 件</span>
                </div>
              </div>

              {results.needsReorder ? (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">
                    <strong>需要立即补货！</strong> 当前库存 ({currentInventory}) 已低于补货预警线 ({results.reorderPoint})，存在断货风险。
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 text-center">
                    当前库存充足，暂无需补货。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
