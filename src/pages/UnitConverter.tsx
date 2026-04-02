import { useState } from 'react';
import { Scale, ArrowRightLeft } from 'lucide-react';

export default function UnitConverter() {
  const [weightValue, setWeightValue] = useState<number | ''>(1);
  const [weightFrom, setWeightFrom] = useState('kg');
  const [weightTo, setWeightTo] = useState('lb');

  const [length, setLength] = useState<number | ''>(10);
  const [width, setWidth] = useState<number | ''>(10);
  const [height, setHeight] = useState<number | ''>(10);
  const [dimFrom, setDimFrom] = useState('cm');
  const [dimTo, setDimTo] = useState('in');

  // Weight conversion logic
  const convertedWeight = () => {
    if (weightValue === '') return '';
    let valInKg = weightValue;
    if (weightFrom === 'lb') valInKg = weightValue * 0.453592;
    if (weightFrom === 'g') valInKg = weightValue / 1000;

    if (weightTo === 'kg') return valInKg.toFixed(2);
    if (weightTo === 'lb') return (valInKg * 2.20462).toFixed(2);
    if (weightTo === 'g') return (valInKg * 1000).toFixed(2);
    return '';
  };

  // Dimension conversion logic
  const convertDim = (val: number | '') => {
    if (val === '') return '';
    if (dimFrom === dimTo) return val.toFixed(2);
    if (dimFrom === 'cm' && dimTo === 'in') return (val * 0.393701).toFixed(2);
    if (dimFrom === 'in' && dimTo === 'cm') return (val * 2.54).toFixed(2);
    return '';
  };

  // Volumetric weight (材积重) logic
  // Amazon formula: L * W * H (in cm) / 5000 = Volumetric Weight in kg
  const volumetricWeight = () => {
    if (length === '' || width === '' || height === '') return '';
    
    let lCm = length;
    let wCm = width;
    let hCm = height;

    if (dimFrom === 'in') {
      lCm = length * 2.54;
      wCm = width * 2.54;
      hCm = height * 2.54;
    }

    return ((lCm * wCm * hCm) / 5000).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Scale className="w-6 h-6 mr-2 text-blue-500" />
            重量与尺寸转换
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            快速转换公制与英制单位，自动计算亚马逊材积重。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Converter */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">重量转换</h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5 pr-16"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={weightFrom}
                    onChange={(e) => setWeightFrom(e.target.value)}
                    className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            </div>

            <ArrowRightLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />

            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={convertedWeight()}
                  className="w-full rounded-md border-gray-300 bg-gray-50 sm:text-sm border p-2.5 pr-16 font-medium text-gray-900"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    value={weightTo}
                    onChange={(e) => setWeightTo(e.target.value)}
                    className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lb">lb</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dimension Converter */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex justify-between items-center">
            尺寸转换与材积重
            <div className="flex items-center space-x-2 text-sm font-normal">
              <select
                value={dimFrom}
                onChange={(e) => {
                  setDimFrom(e.target.value);
                  setDimTo(e.target.value === 'cm' ? 'in' : 'cm');
                }}
                className="rounded-md border-gray-300 py-1 pl-2 pr-6 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="cm">厘米 (cm)</option>
                <option value="in">英寸 (in)</option>
              </select>
              <span>→</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">{dimTo}</span>
            </div>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">长</label>
                <input type="number" min="0" value={length} onChange={(e) => setLength(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                <div className="mt-1 text-sm font-medium text-gray-700">{convertDim(length)} {dimTo}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">宽</label>
                <input type="number" min="0" value={width} onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                <div className="mt-1 text-sm font-medium text-gray-700">{convertDim(width)} {dimTo}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">高</label>
                <input type="number" min="0" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                <div className="mt-1 text-sm font-medium text-gray-700">{convertDim(height)} {dimTo}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-900">亚马逊材积重 (Volumetric Weight)</p>
                  <p className="text-xs text-blue-700 mt-0.5">公式: 长×宽×高(cm) / 5000</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700">{volumetricWeight()} <span className="text-sm font-normal">kg</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
