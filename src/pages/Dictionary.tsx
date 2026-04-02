import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';

const DICTIONARY = [
  { term: 'FBA', full: 'Fulfillment by Amazon', category: '运营', desc: '亚马逊物流。卖家将商品发送至亚马逊运营中心，由亚马逊负责仓储、拣货、包装、发货及客服。', example: '使用FBA可以获得Prime标志，提高转化率。' },
  { term: 'FBM', full: 'Fulfillment by Merchant', category: '运营', desc: '卖家自发货。卖家自己负责仓储、包装、发货和客服。', example: '大件或超重商品通常使用FBM以节省运费。' },
  { term: 'BSR', full: 'Best Sellers Rank', category: '运营', desc: '畅销排行榜。反映产品在特定类目下的销售表现，排名越靠前销量越好。', example: '我的产品在厨房类目BSR排名进入了前100。' },
  { term: 'ACOS', full: 'Advertising Cost of Sales', category: '营销', desc: '广告投入产出比。计算公式：广告总花费 ÷ 广告带来的总销售额。', example: '广告花费100元，销售额500元，ACOS=20%。' },
  { term: 'SKU', full: 'Stock Keeping Unit', category: '运营', desc: '库存进出计量的基本单元。卖家自己设定的产品唯一标识码。', example: '红色M码T恤的SKU可以是 T-RED-M。' },
  { term: 'ASIN', full: 'Amazon Standard Identification Number', category: '运营', desc: '亚马逊标准标识号。亚马逊系统自动为每个产品分配的唯一10位字符。', example: '通过ASIN可以在前台快速搜索到对应产品。' },
  { term: 'Listing', full: '-', category: '运营', desc: '产品详情页。包含标题、图片、五点描述、产品描述、价格等信息。', example: '优化Listing是提高转化率的关键步骤。' },
  { term: 'Referral Fee', full: '-', category: '成本', desc: '亚马逊推荐费（佣金）。亚马逊按销售价格的一定比例收取的费用，不同类目比例不同（通常为15%）。', example: '售价100美金，15%的推荐费就是15美金。' },
  { term: 'Buy Box', full: '-', category: '运营', desc: '黄金购物车。产品详情页右侧的"Add to Cart"按钮，获得Buy Box的卖家能获得绝大部分订单。', example: 'FBA发货、价格优势和良好的账号表现有助于赢得Buy Box。' },
];

export default function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  const categories = ['全部', ...Array.from(new Set(DICTIONARY.map(item => item.category)))];

  const filteredDict = DICTIONARY.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-600" />
            亚马逊术语词典
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            快速理解亚马逊专业术语，降低学习门槛。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索术语或解释..."
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDict.length > 0 ? (
            filteredDict.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.term}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {item.category}
                  </span>
                </div>
                {item.full !== '-' && <p className="text-xs text-gray-500 mb-2 font-mono">{item.full}</p>}
                <p className="text-sm text-gray-700 mb-3">{item.desc}</p>
                <div className="bg-indigo-50 p-2 rounded text-xs text-indigo-800">
                  <span className="font-semibold">例：</span>{item.example}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-gray-500">
              没有找到匹配的术语
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
