import { useState, useEffect, useRef } from 'react';
import { Barcode as BarcodeIcon, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import bwipjs from 'bwip-js';

export default function BarcodeGenerator() {
  const [type, setType] = useState('upca');
  const [value, setValue] = useState('123456789012');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [type, value]);

  const generateBarcode = () => {
    if (!value) {
      setError('请输入条码内容');
      return;
    }

    try {
      if (canvasRef.current) {
        bwipjs.toCanvas(canvasRef.current, {
          bcid: type,       // Barcode type
          text: value,      // Text to encode
          scale: 3,         // 3x scaling factor
          height: 15,       // Bar height, in millimeters
          includetext: true, // Show human-readable text
          textxalign: 'center', // Always good to set this
        });
        setError('');
      }
    } catch (e: any) {
      setError(e.message || '生成失败，请检查输入格式是否正确');
    }
  };

  const downloadBarcode = () => {
    if (canvasRef.current && !error) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `barcode-${value}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Simple validation logic for demo
  const isValid = !error && value.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarcodeIcon className="w-6 h-6 mr-2 text-gray-800" />
            UPC/EAN条码生成器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            生成符合标准的UPC/EAN条码图片，用于产品包装。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">条码类型</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="barcodeType"
                  value="upca"
                  checked={type === 'upca'}
                  onChange={(e) => {
                    setType(e.target.value);
                    setValue('123456789012'); // Default 12 digits for UPC-A
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">UPC-A (北美常用, 12位)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="barcodeType"
                  value="ean13"
                  checked={type === 'ean13'}
                  onChange={(e) => {
                    setType(e.target.value);
                    setValue('1234567890123'); // Default 13 digits for EAN-13
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">EAN-13 (欧洲/全球, 13位)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">条码编号</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))} // Only allow digits
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5"
              placeholder={type === 'upca' ? '输入12位数字' : '输入13位数字'}
            />
            <p className="mt-2 text-xs text-gray-500">
              注意：请确保您使用的是通过正规渠道 (如GS1) 购买的合法条码，否则可能导致Listing被移除。
            </p>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
          <div className="mb-6 w-full flex justify-center bg-white p-4 rounded-md">
            <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
          </div>
          
          {error ? (
            <div className="flex items-center text-red-600 text-sm mb-4">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {error}
            </div>
          ) : (
            <div className="flex items-center text-green-600 text-sm mb-4">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              格式验证通过
            </div>
          )}

          <button
            onClick={downloadBarcode}
            disabled={!isValid}
            className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-400"
          >
            <Download className="w-5 h-5 mr-2" />
            下载 PNG 图片
          </button>
        </div>
      </div>
    </div>
  );
}
