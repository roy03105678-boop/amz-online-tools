import { useState, useMemo } from 'react';
import { BarChart2, Info } from 'lucide-react';

export default function ABTestCalculator() {
  const [visitorsA, setVisitorsA] = useState<number | ''>(1000);
  const [conversionsA, setConversionsA] = useState<number | ''>(50);
  const [visitorsB, setVisitorsB] = useState<number | ''>(1000);
  const [conversionsB, setConversionsB] = useState<number | ''>(65);

  const results = useMemo(() => {
    if (visitorsA === '' || conversionsA === '' || visitorsB === '' || conversionsB === '') return null;
    if (visitorsA === 0 || visitorsB === 0) return null;

    const crA = conversionsA / visitorsA;
    const crB = conversionsB / visitorsB;
    
    // Z-test for two proportions
    const pPool = (conversionsA + conversionsB) / (visitorsA + visitorsB);
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / visitorsA + 1 / visitorsB));
    
    let zScore = 0;
    let pValue = 1;
    let confidence = 0;
    
    if (se > 0) {
      zScore = (crB - crA) / se;
      // Approximation for normal distribution CDF
      const z = Math.abs(zScore);
      const t = 1 / (1 + 0.2316419 * z);
      const d = 0.3989423 * Math.exp(-z * z / 2);
      const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      pValue = prob;
      confidence = (1 - pValue) * 100;
    }

    const improvement = crA > 0 ? ((crB - crA) / crA) * 100 : 0;

    let conclusion = '';
    let color = '';
    
    if (confidence >= 95) {
      conclusion = crB > crA ? '方案 B 显著优于 方案 A' : '方案 A 显著优于 方案 B';
      color = crB > crA ? 'text-green-600' : 'text-red-600';
    } else if (confidence >= 90) {
      conclusion = crB > crA ? '方案 B 可能优于 方案 A (置信度较低)' : '方案 A 可能优于 方案 B (置信度较低)';
      color = 'text-yellow-600';
    } else {
      conclusion = '无显著差异 (需要更多数据)';
      color = 'text-gray-600';
    }

    return {
      crA: (crA * 100).toFixed(2),
      crB: (crB * 100).toFixed(2),
      improvement: improvement.toFixed(2),
      confidence: confidence.toFixed(2),
      conclusion,
      color
    };
  }, [visitorsA, conversionsA, visitorsB, conversionsB]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart2 className="w-6 h-6 mr-2 text-purple-600" />
            A/B 测试显著性计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            科学验证主图、价格等修改是否真正提升了转化率，拒绝凭感觉运营。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Variation A */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 flex items-center">
                <span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                方案 A (原版)
              </h3>
              <div>
                <label className="block text-xs text-gray-500 mb-1">展现量 / 访客数</label>
                <input type="number" min="0" value={visitorsA} onChange={e => setVisitorsA(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">订单量 / 转化数</label>
                <input type="number" min="0" value={conversionsA} onChange={e => setConversionsA(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              </div>
              {results && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">转化率 (CR)</p>
                  <p className="text-lg font-bold text-gray-700">{results.crA}%</p>
                </div>
              )}
            </div>

            {/* Variation B */}
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="font-medium text-purple-900 flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                方案 B (测试版)
              </h3>
              <div>
                <label className="block text-xs text-purple-700 mb-1">展现量 / 访客数</label>
                <input type="number" min="0" value={visitorsB} onChange={e => setVisitorsB(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-purple-200 focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-xs text-purple-700 mb-1">订单量 / 转化数</label>
                <input type="number" min="0" value={conversionsB} onChange={e => setConversionsB(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-purple-200 focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2" />
              </div>
              {results && (
                <div className="pt-2 border-t border-purple-200">
                  <p className="text-xs text-purple-700">转化率 (CR)</p>
                  <p className="text-lg font-bold text-purple-900">{results.crB}%</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-6">测试结果</h3>
          
          {results ? (
            <div className="flex-1 flex flex-col space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">统计学结论</p>
                <p className={`text-2xl font-bold ${results.color}`}>
                  {results.conclusion}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">转化率相对提升</p>
                  <p className={`text-xl font-bold ${Number(results.improvement) > 0 ? 'text-green-600' : Number(results.improvement) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {Number(results.improvement) > 0 ? '+' : ''}{results.improvement}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">统计置信度</p>
                  <p className="text-xl font-bold text-gray-900">
                    {results.confidence}%
                  </p>
                </div>
              </div>

              <div className="mt-auto bg-blue-50 rounded-md p-4 flex items-start border border-blue-100">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>如何理解置信度？</strong><br/>
                  置信度达到 <strong>95%</strong> 以上，说明数据差异大概率是由您的修改引起的，而不是偶然的运气。如果低于 90%，建议继续积累数据，或者认为修改无效。
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              请输入完整数据以获取计算结果
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
