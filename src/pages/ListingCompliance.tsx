import { useState } from 'react';
import { CheckSquare, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ListingCompliance() {
  const [site, setSite] = useState('US');
  const [title, setTitle] = useState('');
  const [bulletPoints, setBulletPoints] = useState(['', '', '', '', '']);
  const [description, setDescription] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<{
    title: { valid: boolean; issues: string[] };
    bullets: { valid: boolean; issues: string[] }[];
    description: { valid: boolean; issues: string[] };
  } | null>(null);

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...bulletPoints];
    newBullets[index] = value;
    setBulletPoints(newBullets);
  };

  const checkCompliance = () => {
    setIsChecking(true);
    
    // Simulate API call / processing time
    setTimeout(() => {
      const newResults = {
        title: { valid: true, issues: [] as string[] },
        bullets: bulletPoints.map(() => ({ valid: true, issues: [] as string[] })),
        description: { valid: true, issues: [] as string[] }
      };

      // Title Checks
      const titleLimit = site === 'JP' ? 80 : 200;
      if (title.length > titleLimit) {
        newResults.title.valid = false;
        newResults.title.issues.push(`标题长度超出限制 (${title.length}/${titleLimit} 字符)`);
      }
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(title)) {
        newResults.title.valid = false;
        newResults.title.issues.push('标题包含特殊符号，建议移除');
      }
      if (/(best|top|only|#1|guarantee)/i.test(title)) {
        newResults.title.valid = false;
        newResults.title.issues.push('标题包含违规营销词汇 (如 best, top 等)');
      }

      // Bullet Points Checks
      bulletPoints.forEach((bullet, idx) => {
        if (bullet.length > 500) {
          newResults.bullets[idx].valid = false;
          newResults.bullets[idx].issues.push(`五点描述第 ${idx + 1} 点长度超出限制 (建议 < 500 字符)`);
        }
        if (bullet.length > 0 && !/^[A-Z0-9]/.test(bullet)) {
          newResults.bullets[idx].valid = false;
          newResults.bullets[idx].issues.push(`五点描述第 ${idx + 1} 点建议以大写字母或数字开头`);
        }
      });

      // Description Checks
      if (/<[a-z][\s\S]*>/i.test(description) && !/<\/?(b|br|p)>/i.test(description)) {
        newResults.description.valid = false;
        newResults.description.issues.push('产品描述包含禁止使用的 HTML 标签 (仅允许 b, br, p)');
      }
      if (/(best|top|only|#1|guarantee)/i.test(description)) {
        newResults.description.valid = false;
        newResults.description.issues.push('产品描述包含绝对化营销术语');
      }

      setResults(newResults);
      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckSquare className="w-6 h-6 mr-2 text-blue-600" />
            Listing合规检查器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            检查标题、五点描述、产品描述的合规性，规避下架风险。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">目标站点</label>
              <select 
                value={site} onChange={(e) => setSite(e.target.value)}
                className="w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="US">美国 (US)</option>
                <option value="UK">英国 (UK)</option>
                <option value="DE">德国 (DE)</option>
                <option value="JP">日本 (JP)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  产品标题 (Title)
                  <span className="ml-2 text-xs text-gray-400 font-normal">{title.length} 字符</span>
                </label>
                <textarea 
                  rows={2} value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="输入产品标题..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">五点描述 (Bullet Points)</label>
                <div className="space-y-2">
                  {bulletPoints.map((bullet, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">{idx + 1}.</span>
                      <textarea 
                        rows={2} value={bullet} onChange={(e) => handleBulletChange(idx, e.target.value)}
                        className="w-full pl-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        placeholder={`输入第 ${idx + 1} 点描述...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">产品描述 (Product Description)</label>
                <textarea 
                  rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="输入产品详细描述..."
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={checkCompliance}
                disabled={isChecking || (!title && !bulletPoints.some(b => b) && !description)}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isChecking ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <CheckSquare className="w-5 h-5 mr-2" />
                )}
                开始检查
              </button>
            </div>
          </div>
        </div>

        <div>
          {results ? (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 space-y-6">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-3">检查报告</h3>
              
              {/* Title Results */}
              <div>
                <div className="flex items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900 w-24">标题</h4>
                  {results.title.valid ? (
                    <span className="flex items-center text-sm text-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> 合规</span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600"><AlertTriangle className="w-4 h-4 mr-1" /> 发现问题</span>
                  )}
                </div>
                {!results.title.valid && (
                  <ul className="ml-24 list-disc pl-4 text-sm text-red-600 space-y-1">
                    {results.title.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                )}
              </div>

              {/* Bullet Points Results */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">五点描述</h4>
                <div className="space-y-3">
                  {results.bullets.map((res, idx) => {
                    if (!bulletPoints[idx]) return null;
                    return (
                      <div key={idx} className="ml-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 w-20">第 {idx + 1} 点</span>
                          {res.valid ? (
                            <span className="flex items-center text-sm text-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> 合规</span>
                          ) : (
                            <span className="flex items-center text-sm text-red-600"><AlertTriangle className="w-4 h-4 mr-1" /> 发现问题</span>
                          )}
                        </div>
                        {!res.valid && (
                          <ul className="ml-20 list-disc pl-4 text-sm text-red-600 space-y-1 mt-1">
                            {res.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description Results */}
              <div>
                <div className="flex items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-900 w-24">产品描述</h4>
                  {results.description.valid ? (
                    <span className="flex items-center text-sm text-green-600"><CheckCircle2 className="w-4 h-4 mr-1" /> 合规</span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600"><AlertTriangle className="w-4 h-4 mr-1" /> 发现问题</span>
                  )}
                </div>
                {!results.description.valid && (
                  <ul className="ml-24 list-disc pl-4 text-sm text-red-600 space-y-1">
                    {results.description.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg h-full min-h-[300px] flex flex-col items-center justify-center text-gray-500 p-6 text-center">
              <CheckSquare className="w-12 h-12 text-gray-300 mb-4" />
              <p>在左侧输入内容并点击"开始检查"以获取合规报告</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
