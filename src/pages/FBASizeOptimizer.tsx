import { useState, useMemo } from 'react';
import { Maximize, AlertTriangle } from 'lucide-react';

// Simplified US FBA Tiers (Example data)
const TIERS = [
  { name: '小号标准 (Small Standard)', maxL: 15, maxW: 12, maxH: 0.75, maxWt: 1 },
  { name: '大号标准 (Large Standard)', maxL: 18, maxW: 14, maxH: 8, maxWt: 20 },
  { name: '小号大件 (Small Oversize)', maxL: 60, maxW: 30, maxH: 130, maxWt: 70 }, // maxH is length+girth limit simplified
];

export default function FBASizeOptimizer() {
  const [length, setLength] = useState<number | ''>(14.5);
  const [width, setWidth] = useState<number | ''>(11.5);
  const [height, setHeight] = useState<number | ''>(0.8);
  const [weight, setWeight] = useState<number | ''>(0.9);

  const results = useMemo(() => {
    if (length === '' || width === '' || height === '' || weight === '') return null;

    // Sort dimensions descending to match L, W, H
    const dims = [length, width, height].sort((a, b) => b - a);
    const l = dims[0];
    const w = dims[1];
    const h = dims[2];
    const wt = weight;

    let currentTier = null;
    let nextTier = null;
    let optimizationTip = null;

    for (let i = 0; i < TIERS.length; i++) {
      const tier = TIERS[i];
      if (l <= tier.maxL && w <= tier.maxW && h <= tier.maxH && wt <= tier.maxWt) {
        currentTier = tier;
        if (i > 0) {
          nextTier = TIERS[i - 1];
        }
        break;
      }
    }

    if (!currentTier) {
      currentTier = { name: '超大件 (Special Oversize)', maxL: 999, maxW: 999, maxH: 999, maxWt: 999 };
      nextTier = TIERS[TIERS.length - 1];
    }

    if (nextTier) {
      // Check if we are close to the next smaller tier
      const lDiff = l - nextTier.maxL;
      const wDiff = w - nextTier.maxW;
      const hDiff = h - nextTier.maxH;
      const wtDiff = wt - nextTier.maxWt;

      const limitsExceeded = [];
      if (lDiff > 0) limitsExceeded.push(`长度超 ${lDiff.toFixed(2)}"`);
      if (wDiff > 0) limitsExceeded.push(`宽度超 ${wDiff.toFixed(2)}"`);
      if (hDiff > 0) limitsExceeded.push(`高度超 ${hDiff.toFixed(2)}"`);
      if (wtDiff > 0) limitsExceeded.push(`重量超 ${wtDiff.toFixed(2)}lb`);

      if (limitsExceeded.length > 0 && limitsExceeded.length <= 2) {
        // Only show tip if it's realistic to compress (e.g. only 1 or 2 dimensions slightly over)
        const isClose = (lDiff <= 1 && wDiff <= 1 && hDiff <= 0.5 && wtDiff <= 0.5);
        if (isClose) {
          optimizationTip = `临界值预警！您的产品仅因 ${limitsExceeded.join('、')} 被归入【${currentTier.name}】。如果能压缩包装，即可降级至【${nextTier.name}】，大幅节省 FBA 运费！`;
        }
      }
    }

    return { currentTier, optimizationTip };
  }, [length, width, height, weight]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Maximize className="w-6 h-6 mr-2 text-blue-600" />
            FBA 尺寸分段优化器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            智能判断 FBA 尺寸分段，提示包装压缩空间，帮您节省运费。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">输入包装尺寸 (英寸/磅)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">最长边 (Length)</label>
              <input type="number" min="0" step="0.1" value={length} onChange={(e) => setLength(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">次长边 (Width)</label>
              <input type="number" min="0" step="0.1" value={width} onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">最短边 (Height)</label>
              <input type="number" min="0" step="0.1" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">重量 (Weight)</label>
              <input type="number" min="0" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">分析结果</h3>
          
          {results ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">当前所属尺寸分段</p>
                <p className="text-2xl font-bold text-gray-900">{results.currentTier.name}</p>
              </div>

              {results.optimizationTip && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800 leading-relaxed">
                    {results.optimizationTip}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              请输入完整尺寸数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
