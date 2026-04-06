import { Link } from 'react-router-dom';
import { LucideIcon, Heart, Search as SearchIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useBookmarks } from '../lib/useBookmarks';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  priority: number;
}

export default function Home({ tools }: { tools: Tool[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const categories = [
    { id: 1, name: '核心生存工具', desc: '解决盈利验证与基础运营痛点' },
    { id: 2, name: 'Listing优化', desc: '提升曝光与转化，避免违规' },
    { id: 3, name: '合规与效率', desc: '降低运营风险，提升管理效率' },
    { id: 4, name: '增值服务', desc: '补充次要需求，提升体验' },
  ];

  // 过滤工具：先按搜索词，再按收藏状态
  const filteredTools = useMemo(() => {
    let result = tools;

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(query));
    }

    // 按收藏状态过滤
    if (showBookmarksOnly) {
      result = result.filter(t => isBookmarked(t.id));
    }

    return result;
  }, [searchQuery, showBookmarksOnly, tools, isBookmarked]);

  // 统计收藏数量
  const bookmarkCount = tools.filter(t => isBookmarked(t.id)).length;

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">欢迎使用亚马逊卖家工具箱</h2>
        <p className="mt-2 text-lg text-gray-600">
          专为卖家设计，无需API授权，即用即走。帮助您解决成本核算、Listing优化、时间管理等高频痛点。
        </p>
      </div>

      {/* 搜索和过滤栏 */}
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索工具..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 收藏过滤按钮 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              showBookmarksOnly
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart className={`h-4 w-4 ${showBookmarksOnly ? 'fill-current' : ''}`} />
            <span>我的收藏</span>
            {bookmarkCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 搜索结果提示 */}
      {searchQuery.trim() && (
        <div className="text-sm text-gray-600">
          找到 <span className="font-semibold">{filteredTools.length}</span> 个匹配的工具
        </div>
      )}

      {/* 工具列表 */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {showBookmarksOnly ? '您还没有收藏任何工具' : '未找到匹配的工具'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map(category => {
            const categoryTools = filteredTools.filter(t => t.priority === category.id);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.desc}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      {/* 收藏按钮 */}
                      <button
                        onClick={() => toggleBookmark(tool.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={isBookmarked(tool.id) ? '取消收藏' : '收藏'}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            isBookmarked(tool.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        />
                      </button>

                      {/* 工具信息 */}
                      <Link
                        to={tool.path}
                        className="flex items-center space-x-3 flex-1 min-w-0"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <tool.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
