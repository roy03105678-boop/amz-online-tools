import { useState } from 'react';
import { Languages, ArrowRight, Copy, Check, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function Translation() {
  const [sourceText, setSourceText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    setError('');
    
    try {
      const apiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY) || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        //throw new Error('未配置 Gemini API Key');
        throw new Error('正在开发中，敬请期待！');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const langMap: Record<string, string> = {
        'en': '英语 (English)',
        'de': '德语 (German)',
        'fr': '法语 (French)',
        'es': '西班牙语 (Spanish)',
        'ja': '日语 (Japanese)'
      };

      const prompt = `你是一个专业的亚马逊电商翻译专家。请将以下文本翻译成${langMap[targetLang]}。
要求：
1. 符合亚马逊当地站点的电商表达习惯。
2. 保持原有的排版格式。
3. 如果是翻译成英语，请注意将公制单位（如cm, kg）适当转换为英制单位（如inches, lbs），或者在括号内补充英制单位。
4. 只输出翻译结果，不要输出任何解释性的文字。

待翻译文本：
${sourceText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setTranslatedText(response.text || '翻译失败，请重试。');
    } catch (err: any) {
      console.error('Translation error:', err);
      setError(err.message || '翻译过程中发生错误，请稍后重试。');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Languages className="w-6 h-6 mr-2 text-teal-600" />
            文本翻译与本地化助手
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            专为亚马逊卖家设计的翻译工具，包含电商术语库与本地化建议。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* Source Area */}
          <div className="p-5 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">源语言: 中文 (自动检测)</span>
            </div>
            <textarea
              className="flex-1 w-full resize-none border-0 focus:ring-0 p-0 text-gray-900 placeholder-gray-400"
              placeholder="输入需要翻译的产品标题、五点描述或详情..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="flex items-center px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-md hover:bg-teal-700 disabled:bg-teal-300"
              >
                {isTranslating ? '翻译中...' : '翻译'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Target Area */}
          <div className="p-5 flex flex-col h-[500px] bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm border p-1.5 bg-white"
              >
                <option value="en">英语 (美国/英国)</option>
                <option value="de">德语 (德国)</option>
                <option value="fr">法语 (法国)</option>
                <option value="es">西班牙语 (西班牙)</option>
                <option value="ja">日语 (日本)</option>
              </select>
              
              {translatedText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制结果'}
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {translatedText ? (
                <div className="text-gray-900 whitespace-pre-wrap">{translatedText}</div>
              ) : !error ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  翻译结果将显示在这里
                </div>
              ) : null}
            </div>

            {/* Localization Tips (Mock) */}
            {translatedText && targetLang === 'en' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                <h4 className="text-xs font-semibold text-blue-800 mb-1 uppercase">本地化建议</h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>检测到尺寸单位，建议在英国站保留 cm，美国站转换为 inches。</li>
                  <li>"Color" 在英国站建议拼写为 "Colour"。</li>
                </ul>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
