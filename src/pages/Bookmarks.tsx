import { Link } from 'react-router-dom';
import { LucideIcon, Heart, ArrowLeft } from 'lucide-react';
import { useBookmarks } from '../lib/useBookmarks';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  priority: number;
}

export default function Bookmarks({ tools }: { tools: Tool[] }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const categories = [
    { id: 1, name: '核心生存工具', desc: '解决盈利验证与基础运营痛点' },
    { id: 2, name: 'Listing优化', desc: '提升曝光与转化，避免违规' },
    { id: 3, name: '合规与效率', desc: '降低运营风险，提升管理效率' },
    { id: 4, name: '增值服务', desc: '补充次要需求，提升体验' },
  ];

  // 获取所有收藏的工具
  const bookmarkedTools = tools.filter(t => isBookmarked(t.id));

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回首页</span>
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl flex items-center space-x-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <span>我的收藏</span>
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          共收藏了 <span className="font-semibold text-blue-600">{bookmarkedTools.length}</span> 个工具
        </p>
      </div>

      {/* 收藏列表 */}
      {bookmarkedTools.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">您还没有收藏任何工具</p>
          <Link
            to="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            去收藏工具
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {categories.map(category => {
            const categoryTools = bookmarkedTools.filter(t => t.priority === category.id);
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
                      {/* 取消收藏按钮 */}
                      <button
                        onClick={() => toggleBookmark(tool.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="取消收藏"
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500 hover:text-red-700" />
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
