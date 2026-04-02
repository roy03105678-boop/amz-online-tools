import { useState, useMemo } from 'react';
import { Box, Layers, Package } from 'lucide-react';

export default function PalletCalculator() {
  // Item dims
  const [iL, setIL] = useState<number | ''>(5);
  const [iW, setIW] = useState<number | ''>(4);
  const [iH, setIH] = useState<number | ''>(3);
  
  // Carton dims
  const [cL, setCL] = useState<number | ''>(20);
  const [cW, setCW] = useState<number | ''>(16);
  const [cH, setCH] = useState<number | ''>(15);
  const [cWt, setCWt] = useState<number | ''>(25); // lbs

  // Pallet dims (Standard US)
  const [pL] = useState<number>(48);
  const [pW] = useState<number>(40);
  const [pH] = useState<number>(72); // max height
  const [pWtLimit] = useState<number>(1500); // max weight

  const results = useMemo(() => {
    if (!iL || !iW || !iH || !cL || !cW || !cH || !cWt) return null;

    // 1. Items per carton (Simplified: assuming aligned orientation)
    // Try all 6 orientations for item in carton to find max
    const itemDims = [iL, iW, iH];
    let maxItems = 0;
    
    // Simple heuristic: just sort both descending
    const sortedItem = [...itemDims].sort((a, b) => b - a);
    const sortedCarton = [cL, cW, cH].sort((a, b) => b - a);
    
    const itemsPerCarton = 
      Math.floor(sortedCarton[0] / sortedItem[0]) * 
      Math.floor(sortedCarton[1] / sortedItem[1]) * 
      Math.floor(sortedCarton[2] / sortedItem[2]);

    // 2. Cartons per pallet
    // Base layer (48x40)
    // Try 2 orientations for base
    const base1 = Math.floor(pL / cL) * Math.floor(pW / cW);
    const base2 = Math.floor(pL / cW) * Math.floor(pW / cL);
    const cartonsPerLayer = Math.max(base1, base2);

    // Max layers based on height (subtract 6 inches for pallet base)
    const maxLayers = Math.floor((pH - 6) / cH);
    
    let totalCartons = cartonsPerLayer * maxLayers;
    
    // Check weight limit
    const totalWeight = totalCartons * cWt;
    if (totalWeight > pWtLimit) {
      totalCartons = Math.floor(pWtLimit / cWt);
    }

    const totalItems = totalCartons * itemsPerCarton;

    return {
      itemsPerCarton,
      cartonsPerLayer,
      maxLayers,
      totalCartons,
      totalItems,
      totalWeight
    };
  }, [iL, iW, iH, cL, cW, cH, cWt, pL, pW, pH, pWtLimit]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Layers className="w-6 h-6 mr-2 text-indigo-600" />
            托盘与装箱计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            计算单箱装箱量及标准托盘最大码放量，优化头程物流空间。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Box className="w-4 h-4 mr-2"/> 单品尺寸 (英寸)</h3>
            <div className="grid grid-cols-3 gap-4">
              <input type="number" placeholder="长" value={iL} onChange={e => setIL(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              <input type="number" placeholder="宽" value={iW} onChange={e => setIW(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              <input type="number" placeholder="高" value={iH} onChange={e => setIH(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center"><Package className="w-4 h-4 mr-2"/> 外箱尺寸与重量 (英寸/磅)</h3>
            <div className="grid grid-cols-4 gap-4">
              <input type="number" placeholder="长" value={cL} onChange={e => setCL(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              <input type="number" placeholder="宽" value={cW} onChange={e => setCW(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              <input type="number" placeholder="高" value={cH} onChange={e => setCH(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              <input type="number" placeholder="重量" value={cWt} onChange={e => setCWt(e.target.value===''? '':Number(e.target.value))} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">装箱方案</h3>
          {results ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">每箱可装单品数</p>
                <p className="text-2xl font-bold text-gray-900">{results.itemsPerCarton} <span className="text-sm font-normal">pcs/箱</span></p>
              </div>
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">每托盘可装箱数</p>
                <p className="text-2xl font-bold text-indigo-600">{results.totalCartons} <span className="text-sm font-normal">箱/托</span></p>
                <p className="text-xs text-gray-500 mt-1">({results.cartonsPerLayer} 箱/层 × {results.maxLayers} 层)</p>
              </div>
              <div className="pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">每托盘总单品数</p>
                <p className="text-xl font-bold text-gray-900">{results.totalItems} <span className="text-sm font-normal">pcs</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-500">托盘总重量 (预估)</p>
                <p className={`text-lg font-bold ${results.totalWeight >= pWtLimit ? 'text-red-600' : 'text-gray-900'}`}>
                  {results.totalWeight} <span className="text-sm font-normal">lbs</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400">请输入完整尺寸数据</div>
          )}
        </div>
      </div>
    </div>
  );
}
