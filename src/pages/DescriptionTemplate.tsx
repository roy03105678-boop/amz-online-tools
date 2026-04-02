import { useState } from 'react';
import { FileText, Copy, Check } from 'lucide-react';

const TEMPLATES = {
  '3c': {
    name: '3C数码',
    title: '[品牌名] + [核心关键词] + [核心参数/功能] + [适用设备] + [颜色/尺寸]',
    bullets: [
      '【核心卖点】：突出产品最吸引人的功能（如：100W快充，30分钟充满80%）。',
      '【广泛兼容】：列出兼容的主流设备型号，减少退货率。',
      '【材质与耐用性】：说明产品材质（如：尼龙编织线身，通过10000次弯折测试）。',
      '【安全保护】：强调安全认证（如：FCC/CE认证，过充/过热保护）。',
      '【包装与售后】：说明包装内含物及保修政策（如：18个月质保，24小时客服）。'
    ]
  },
  'home': {
    name: '家居用品',
    title: '[品牌名] + [核心关键词] + [材质] + [尺寸/容量] + [适用场景] + [颜色]',
    bullets: [
      '【优质材质】：强调材质的安全性和耐用性（如：100%食品级硅胶，BPA Free）。',
      '【多功能设计】：说明产品的多种用途或巧妙设计。',
      '【易于清洁/维护】：说明清洁方式（如：洗碗机安全，防污防水）。',
      '【适用场景/尺寸】：明确具体尺寸，适合放在哪里（如：完美适配标准厨房抽屉）。',
      '【完美礼物/售后】：适合作为什么节日的礼物，以及售后保障。'
    ]
  }
};

export default function DescriptionTemplate() {
  const [category, setCategory] = useState<keyof typeof TEMPLATES>('3c');
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);

  const template = TEMPLATES[category];

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-600" />
            产品描述生成模板
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            按类目提供标准化的标题与五点描述结构，快速填空生成。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">选择产品类目</label>
        <div className="flex space-x-4">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setCategory(key as keyof typeof TEMPLATES)}
              className={`px-4 py-2 text-sm font-medium rounded-md border ${
                category === key 
                  ? 'bg-purple-50 border-purple-200 text-purple-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Title Template */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">标题公式 (Title Formula)</h3>
            <button
              onClick={() => handleCopy(template.title, setCopiedTitle)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {copiedTitle ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedTitle ? '已复制' : '复制公式'}
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-md border border-gray-100 font-mono text-sm text-gray-800">
            {template.title}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            提示：将括号内的内容替换为您的实际产品信息。核心关键词尽量靠前放置。
          </p>
        </div>

        {/* Bullets Template */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">五点描述结构 (Bullet Points)</h3>
            <button
              onClick={() => handleCopy(template.bullets.join('\n'), setCopiedBullets)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              {copiedBullets ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedBullets ? '已复制' : '复制全部'}
            </button>
          </div>
          <div className="space-y-3">
            {template.bullets.map((bullet, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-100 text-sm text-gray-800 flex">
                <span className="font-bold mr-2 text-gray-400">{idx + 1}.</span>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
