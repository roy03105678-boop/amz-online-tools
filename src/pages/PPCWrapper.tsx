import { useState, useMemo } from 'react';
import { Target, Copy, Check } from 'lucide-react';

export default function PPCWrapper() {
  const [keywords, setKeywords] = useState('');
  const [matchTypes, setMatchTypes] = useState({
    exact: true,
    phrase: true,
    broad: true,
  });
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    if (!keywords.trim()) return '';

    const lines = keywords.split('\n').map(k => k.trim()).filter(k => k);
    let output: string[] = [];

    lines.forEach(kw => {
      if (matchTypes.exact) output.push(`[${kw}]`);
      if (matchTypes.phrase) output.push(`"${kw}"`);
      if (matchTypes.broad) {
        const broadKw = kw.split(/\s+/).map(w => `+${w}`).join(' ');
        output.push(broadKw);
      }
    });

    return output.join('\n');
  }, [keywords, matchTypes]);

  const handleCopy = () => {
    navigator.clipboard.writeText(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Target className="w-6 h-6 mr-2 text-red-600" />
            PPC 关键词匹配生成器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            一键为广告关键词添加精准、词组、广泛修饰符符号，方便批量投放。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 flex flex-col h-[500px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">输入基础关键词 (每行一个)</label>
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="flex-1 w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-3 resize-none"
            placeholder="gaming mouse&#10;wireless mouse&#10;rgb mouse"
          />
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">选择生成的匹配类型</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={matchTypes.exact}
                  onChange={(e) => setMatchTypes({...matchTypes, exact: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">精准 [Exact]</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={matchTypes.phrase}
                  onChange={(e) => setMatchTypes({...matchTypes, phrase: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">词组 "Phrase"</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={matchTypes.broad}
                  onChange={(e) => setMatchTypes({...matchTypes, broad: e.target.checked})}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700">广泛 +Broad</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">生成结果</label>
            <button
              onClick={handleCopy}
              disabled={!results}
              className="flex items-center text-sm text-red-600 hover:text-red-700 disabled:text-gray-400"
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? '已复制' : '复制结果'}
            </button>
          </div>
          
          <textarea
            readOnly
            value={results}
            className="flex-1 w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm border p-3 resize-none text-gray-800 font-mono"
            placeholder="生成的关键词将显示在这里..."
          />
        </div>
      </div>
    </div>
  );
}
