import { useState } from 'react';
import { Search, BarChart2 } from 'lucide-react';

export default function KeywordDensity() {
  const [text, setText] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [results, setResults] = useState<{ word: string; count: number; density: number }[] | null>(null);

  const analyzeDensity = () => {
    if (!text.trim()) return;

    // Basic word extraction (simplified for demo)
    const words = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fa5]/g, '').split(/\s+/).filter(w => w.length > 2);
    const totalWords = words.length;
    
    if (totalWords === 0) return;

    const wordCounts: Record<string, number> = {};
    words.forEach(w => {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });

    let analysisResults = [];

    if (targetKeywords.trim()) {
      // Analyze specific targets
      const targets = targetKeywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
      targets.forEach(target => {
        // Count occurrences of the exact phrase in the original text
        const regex = new RegExp(`\\b${target}\\b`, 'gi');
        const matches = text.match(regex);
        const count = matches ? matches.length : 0;
        // For phrases, density is calculated against total words (approximate)
        const density = (count * target.split(/\s+/).length / totalWords) * 100;
        analysisResults.push({ word: target, count, density });
      });
    } else {
      // Analyze all words
      analysisResults = Object.entries(wordCounts)
        .map(([word, count]) => ({
          word,
          count,
          density: (count / totalWords) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Top 15 words
    }

    setResults(analysisResults);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Search className="w-6 h-6 mr-2 text-indigo-600" />
            关键词密度分析器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            分析Listing文本中的关键词频率，避免过度堆砌。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分析文本 (标题/五点/描述)
                </label>
                <textarea 
                  rows={8} value={text} onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="粘贴需要分析的Listing文本..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标关键词 (可选)
                </label>
                <input 
                  type="text" value={targetKeywords} onChange={(e) => setTargetKeywords(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  placeholder="输入目标关键词，用逗号分隔，如：wireless mouse, gaming"
                />
                <p className="mt-1 text-xs text-gray-500">如果不填，将自动提取出现频率最高的词汇。</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={analyzeDensity}
                disabled={!text.trim()}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                开始分析
              </button>
            </div>
          </div>
        </div>

        <div>
          {results ? (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3 mb-4">分析结果</h3>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关键词</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">出现次数</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">密度</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((res, idx) => {
                      let status = '正常';
                      let statusColor = 'text-green-600 bg-green-100';
                      
                      if (res.density > 5) {
                        status = '堆砌风险';
                        statusColor = 'text-red-600 bg-red-100';
                      } else if (res.density < 1 && targetKeywords) {
                        status = '密度偏低';
                        statusColor = 'text-orange-600 bg-orange-100';
                      }

                      return (
                        <tr key={idx}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{res.word}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{res.count} 次</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{res.density.toFixed(2)}%</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                建议：核心关键词密度保持在 2% - 5% 之间，长尾词 1% - 2%。超过 5% 可能被判定为关键词堆砌。
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <BarChart2 className="w-12 h-12 text-gray-300 mb-4" />
              <p>在左侧输入文本并点击"开始分析"以获取关键词密度报告</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
