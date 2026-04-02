import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  priority: number;
}

export default function Home({ tools }: { tools: Tool[] }) {
  const categories = [
    { id: 1, name: '核心生存工具', desc: '解决盈利验证与基础运营痛点' },
    { id: 2, name: 'Listing优化', desc: '提升曝光与转化，避免违规' },
    { id: 3, name: '合规与效率', desc: '降低运营风险，提升管理效率' },
    { id: 4, name: '增值服务', desc: '补充次要需求，提升体验' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">欢迎使用亚马逊新卖家工具箱</h2>
        <p className="mt-2 text-lg text-gray-600">
          专为新卖家设计，无需API授权，即用即走。帮助您解决成本核算、Listing优化、时间管理等高频痛点。
        </p>
      </div>

      <div className="space-y-10">
        {categories.map(category => {
          const categoryTools = tools.filter(t => t.priority === category.id);
          if (categoryTools.length === 0) return null;
          
          return (
            <div key={category.id}>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:border-blue-400 hover:shadow-md transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                        <tool.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
