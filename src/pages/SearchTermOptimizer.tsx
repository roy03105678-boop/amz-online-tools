import { useState, useMemo } from 'react';
import { Scissors, Copy, Check, AlertCircle } from 'lucide-react';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 
  'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 
  'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'
]);

export default function SearchTermOptimizer() {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!inputText.trim()) return { text: '', bytes: 0, words: 0, removed: 0 };

    // 1. Convert to lowercase
    let processed = inputText.toLowerCase();
    
    // 2. Replace punctuation with spaces
    processed = processed.replace(/[^\w\s\u4e00-\u9fa5]/g, ' ');
    
    // 3. Split into words
    const words = processed.split(/\s+/).filter(w => w.length > 0);
    
    // 4. Remove duplicates and stop words
    const uniqueWords = new Set<string>();
    let removedCount = 0;
    
    words.forEach(word => {
      if (STOP_WORDS.has(word)) {
        removedCount++;
      } else if (uniqueWords.has(word)) {
        removedCount++;
      } else {
        uniqueWords.add(word);
      }
    });

    // 5. Join with spaces
    const finalText = Array.from(uniqueWords).join(' ');
    
    // 6. Calculate UTF-8 bytes
    const bytes = new Blob([finalText]).size;

    return {
      text: finalText,
      bytes,
      words: uniqueWords.size,
      removed: removedCount
    };
  }, [inputText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(results.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Scissors className="w-6 h-6 mr-2 text-blue-600" />
            Search Term 优化与去重
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            一键去除重复词和停用词，精准计算字节数，确保不超过亚马逊 250 字节限制。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 flex flex-col h-[500px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">输入原始关键词 (支持多行、带标点)</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-3 resize-none"
            placeholder="在此粘贴您的关键词列表，例如：&#10;wireless mouse&#10;mouse for laptop&#10;best wireless mouse 2026..."
          />
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">优化结果</label>
            <button
              onClick={handleCopy}
              disabled={!results.text}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? '已复制' : '复制结果'}
            </button>
          </div>
          
          <div className="relative flex-1 mb-4">
            <textarea
              readOnly
              value={results.text}
              className="w-full h-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm border p-3 resize-none text-gray-800"
              placeholder="优化后的关键词将显示在这里..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">占用字节数 (UTF-8)</span>
              <span className={`text-lg font-bold ${results.bytes > 250 ? 'text-red-600' : 'text-green-600'}`}>
                {results.bytes} / 250
              </span>
            </div>
            
            {results.bytes > 250 && (
              <div className="flex items-start text-xs text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                <span>警告：已超过亚马逊 250 字节限制，超出部分将不被索引，请删减！</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">保留词汇数</p>
                <p className="text-lg font-semibold text-gray-900">{results.words}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">已去除重复/停用词</p>
                <p className="text-lg font-semibold text-blue-600">{results.removed}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
