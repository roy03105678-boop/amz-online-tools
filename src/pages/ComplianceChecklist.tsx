import { useState } from 'react';
import { ListChecks, Download, ChevronDown, ChevronUp } from 'lucide-react';

const CHECKLIST_DATA = {
  '3c': {
    name: '3C数码',
    categories: [
      {
        id: 'cert',
        title: '产品认证',
        items: [
          { id: 'c1', text: '美国站：FCC认证 (无线电射频设备)', checked: false },
          { id: 'c2', text: '欧洲站：CE认证、RoHS指令', checked: false },
          { id: 'c3', text: '日本站：PSE认证 (电器)、TELEC认证 (无线设备)', checked: false },
          { id: 'c4', text: '电池产品：UN38.3测试报告、MSDS', checked: false },
        ]
      },
      {
        id: 'img',
        title: '图片合规',
        items: [
          { id: 'i1', text: '主图背景必须为纯白 (RGB 255,255,255)', checked: false },
          { id: 'i2', text: '主图中产品占比需达到 85% 以上', checked: false },
          { id: 'i3', text: '主图不可包含水印、Logo、促销文字或边框', checked: false },
          { id: 'i4', text: '图片最长边至少 1000 像素 (支持缩放功能)', checked: false },
        ]
      },
      {
        id: 'pkg',
        title: '包装与标签',
        items: [
          { id: 'p1', text: 'FNSKU 标签清晰可见，覆盖原有条码', checked: false },
          { id: 'p2', text: '开口大于 5 英寸的塑料袋需有窒息警告 (Suffocation Warning)', checked: false },
          { id: 'p3', text: '包含电池的产品需贴有电池警告标签', checked: false },
          { id: 'p4', text: '包装上需印有原产地标识 (如 Made in China)', checked: false },
        ]
      }
    ]
  },
  'toys': {
    name: '玩具类目',
    categories: [
      {
        id: 'cert',
        title: '产品认证',
        items: [
          { id: 'c1', text: '美国站：CPC认证 (儿童产品证书)、ASTM F963 测试报告', checked: false },
          { id: 'c2', text: '欧洲站：CE认证、EN71 测试报告', checked: false },
          { id: 'c3', text: '日本站：ST认证 (日本玩具安全标准)', checked: false },
        ]
      },
      {
        id: 'pkg',
        title: '包装与标签',
        items: [
          { id: 'p1', text: '必须包含适用年龄警告 (如 "Not for children under 3 yrs")', checked: false },
          { id: 'p2', text: '小零件警告标识 (Choking Hazard)', checked: false },
          { id: 'p3', text: '溯源标签 (Tracking Label) - 包含制造商、生产日期/批次', checked: false },
        ]
      }
    ]
  },
  'general': {
    name: '通用类目',
    categories: [
      {
        id: 'img',
        title: '图片合规',
        items: [
          { id: 'i1', text: '主图背景必须为纯白 (RGB 255,255,255)', checked: false },
          { id: 'i2', text: '主图中产品占比需达到 85% 以上', checked: false },
          { id: 'i3', text: '主图不可包含水印、Logo、促销文字或边框', checked: false },
        ]
      },
      {
        id: 'pkg',
        title: '包装与标签',
        items: [
          { id: 'p1', text: 'FNSKU 标签清晰可见，覆盖原有条码', checked: false },
          { id: 'p2', text: '开口大于 5 英寸的塑料袋需有窒息警告 (Suffocation Warning)', checked: false },
          { id: 'p3', text: '包装上需印有原产地标识 (如 Made in China)', checked: false },
        ]
      },
      {
        id: 'account',
        title: '账号与运营合规',
        items: [
          { id: 'a1', text: '不使用任何形式的虚假评论 (刷单、好评返现卡)', checked: false },
          { id: 'a2', text: 'Listing 标题、描述不侵犯他人商标权、专利权', checked: false },
          { id: 'a3', text: '不使用多账号操作同一站点同一类目 (防关联)', checked: false },
        ]
      }
    ]
  }
};

export default function ComplianceChecklist() {
  const [category, setCategory] = useState<keyof typeof CHECKLIST_DATA>('general');
  const [checklist, setChecklist] = useState(CHECKLIST_DATA);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    cert: true, img: true, pkg: true, account: true
  });

  const currentData = checklist[category];

  const toggleItem = (catId: string, itemId: string) => {
    const newData = { ...checklist };
    const cat = newData[category].categories.find(c => c.id === catId);
    if (cat) {
      const item = cat.items.find(i => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
        setChecklist(newData);
      }
    }
  };

  const toggleCategory = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const calculateProgress = () => {
    let total = 0;
    let checked = 0;
    currentData.categories.forEach(cat => {
      cat.items.forEach(item => {
        total++;
        if (item.checked) checked++;
      });
    });
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ListChecks className="w-6 h-6 mr-2 text-emerald-600" />
            亚马逊合规检查清单
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            按类目梳理平台合规要求，避免账号受限或产品下架。
          </p>
        </div>
        <button className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          导出PDF
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择产品类目</label>
            <div className="flex space-x-2">
              {Object.entries(CHECKLIST_DATA).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key as keyof typeof CHECKLIST_DATA)}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    category === key 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sm:w-64">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
              <span>完成进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {currentData.categories.map((cat) => (
            <div key={cat.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-sm font-medium text-gray-900">{cat.title}</h3>
                {expandedCats[cat.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {expandedCats[cat.id] && (
                <div className="px-4 py-3 bg-white divide-y divide-gray-100">
                  {cat.items.map((item) => (
                    <div key={item.id} className="flex items-start py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center h-5">
                        <input
                          id={item.id}
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleItem(cat.id, item.id)}
                          className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded cursor-pointer"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={item.id} className={`font-medium cursor-pointer ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {item.text}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
