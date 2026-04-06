import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  DollarSign, 
  Globe, 
  Calendar, 
  CheckSquare, 
  Search,
  Search as SearchIcon, 
  Languages, 
  FileText, 
  ListChecks, 
  Barcode, 
  Package, 
  Scale, 
  Banknote, 
  BookOpen, 
  Map, 
  Star,
  Scissors,
  Code,
  Target,
  TrendingUp,
  Maximize,
  Layers,
  Mail,
  BarChart2,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useBookmarks } from './lib/useBookmarks';
import { useNavigate } from 'react-router-dom';
import { cn } from './lib/utils';

// Tool Components
import Home from './pages/Home';
import Bookmarks from './pages/Bookmarks';
import FBACalculator from './pages/FBACalculator';
import PricingCalculator from './pages/PricingCalculator';
import TimezoneConverter from './pages/TimezoneConverter';
import HolidayCalendar from './pages/HolidayCalendar';
import ListingCompliance from './pages/ListingCompliance';
import KeywordDensity from './pages/KeywordDensity';
import Translation from './pages/Translation';
import DescriptionTemplate from './pages/DescriptionTemplate';
import ComplianceChecklist from './pages/ComplianceChecklist';
import BarcodeGenerator from './pages/BarcodeGenerator';
import InventoryCalculator from './pages/InventoryCalculator';
import UnitConverter from './pages/UnitConverter';
import ExchangeRate from './pages/ExchangeRate';
import Dictionary from './pages/Dictionary';
import StartupProgress from './pages/StartupProgress';
import RatingCalculator from './pages/RatingCalculator';
import SearchTermOptimizer from './pages/SearchTermOptimizer';
import HTMLEditor from './pages/HTMLEditor';
import PPCWrapper from './pages/PPCWrapper';
import ACoSCalculator from './pages/ACoSCalculator';
import FBASizeOptimizer from './pages/FBASizeOptimizer';
import PalletCalculator from './pages/PalletCalculator';
import EmailTemplates from './pages/EmailTemplates';
import ABTestCalculator from './pages/ABTestCalculator';

const TOOLS = [
  { id: 'fba-calculator', name: 'FBA费用计算器', icon: Calculator, path: '/fba-calculator', priority: 1 },
  { id: 'pricing-calculator', name: '定价计算器', icon: DollarSign, path: '/pricing-calculator', priority: 1 },
  { id: 'acos-calculator', name: '盈亏平衡ACoS', icon: TrendingUp, path: '/acos-calculator', priority: 1 },
  { id: 'fba-size-optimizer', name: 'FBA尺寸优化器', icon: Maximize, path: '/fba-size-optimizer', priority: 1 },
  { id: 'timezone-converter', name: '时区转换器', icon: Globe, path: '/timezone-converter', priority: 1 },
  { id: 'holiday-calendar', name: '全球节假日查询', icon: Calendar, path: '/holiday-calendar', priority: 1 },

  { id: 'search-term-optimizer', name: 'Search Term优化', icon: Scissors, path: '/search-term-optimizer', priority: 2 },
  { id: 'html-editor', name: '亚马逊HTML编辑器', icon: Code, path: '/html-editor', priority: 2 },
  { id: 'listing-compliance', name: 'Listing合规检查', icon: CheckSquare, path: '/listing-compliance', priority: 2 },
  { id: 'keyword-density', name: '关键词密度分析', icon: Search, path: '/keyword-density', priority: 2 },
  { id: 'translation', name: '文本翻译与本地化', icon: Languages, path: '/translation', priority: 2 },
  { id: 'description-template', name: '产品描述模板', icon: FileText, path: '/description-template', priority: 2 },

  { id: 'ppc-wrapper', name: 'PPC匹配生成器', icon: Target, path: '/ppc-wrapper', priority: 3 },
  { id: 'ab-test-calculator', name: 'A/B测试显著性', icon: BarChart2, path: '/ab-test-calculator', priority: 3 },
  { id: 'pallet-calculator', name: '托盘与装箱计算', icon: Layers, path: '/pallet-calculator', priority: 3 },
  { id: 'compliance-checklist', name: '合规检查清单', icon: ListChecks, path: '/compliance-checklist', priority: 3 },
  { id: 'barcode-generator', name: 'UPC/EAN生成器', icon: Barcode, path: '/barcode-generator', priority: 3 },
  { id: 'inventory-calculator', name: '库存补货计算器', icon: Package, path: '/inventory-calculator', priority: 3 },

  { id: 'email-templates', name: '合规客服邮件模板', icon: Mail, path: '/email-templates', priority: 4 },
  { id: 'unit-converter', name: '重量与尺寸转换', icon: Scale, path: '/unit-converter', priority: 4 },
  { id: 'exchange-rate', name: '货币汇率参考', icon: Banknote, path: '/exchange-rate', priority: 4 },
  { id: 'dictionary', name: '亚马逊术语词典', icon: BookOpen, path: '/dictionary', priority: 4 },
  { id: 'startup-progress', name: '开店进度表', icon: Map, path: '/startup-progress', priority: 4 },
  { id: 'rating-calculator', name: '评价评分计算器', icon: Star, path: '/rating-calculator', priority: 4 },
];

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const location = useLocation();
  const { bookmarks } = useBookmarks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600" onClick={() => setIsOpen(false)}>
            <Package className="w-6 h-6" />
            <span>AMZ Toolkit</span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {/* 收藏链接 */}
          <nav className="space-y-1 px-2 mb-6">
            <Link
              to="/bookmarks"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                location.pathname === '/bookmarks'
                  ? "bg-red-50 text-red-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Star className={cn(
                "mr-3 flex-shrink-0 h-5 w-5",
                location.pathname === '/bookmarks' ? "text-red-600 fill-red-600" : "text-gray-400 group-hover:text-gray-500"
              )} />
              <span>我的收藏</span>
              {bookmarks.size > 0 && (
                <span className="ml-auto inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {bookmarks.size}
                </span>
              )}
            </Link>
          </nav>

          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">核心生存工具</p>
          </div>
          <nav className="space-y-1 px-2 mb-6">
            {TOOLS.filter(t => t.priority === 1).map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                  location.pathname === tool.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tool.icon className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  location.pathname === tool.path ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {tool.name}
              </Link>
            ))}
          </nav>

          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Listing优化</p>
          </div>
          <nav className="space-y-1 px-2 mb-6">
            {TOOLS.filter(t => t.priority === 2).map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                  location.pathname === tool.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tool.icon className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  location.pathname === tool.path ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {tool.name}
              </Link>
            ))}
          </nav>

          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">合规与效率</p>
          </div>
          <nav className="space-y-1 px-2 mb-6">
            {TOOLS.filter(t => t.priority === 3).map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                  location.pathname === tool.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tool.icon className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  location.pathname === tool.path ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {tool.name}
              </Link>
            ))}
          </nav>

          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">增值服务</p>
          </div>
          <nav className="space-y-1 px-2">
            {TOOLS.filter(t => t.priority === 4).map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                  location.pathname === tool.path
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <tool.icon className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  location.pathname === tool.path ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                )} />
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const location = useLocation();

  // 同步 URL 参数到搜索框
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location.search]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8 justify-between gap-4">
          <div className="flex items-center min-w-0">
            <button
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700 flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block whitespace-nowrap">亚马逊卖家工具箱</h1>
          </div>
          
          {/* 搜索框 */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (location.pathname === '/') {
                    const params = new URLSearchParams(location.search);
                    if (val) {
                      params.set('q', val);
                    } else {
                      params.delete('q');
                    }
                    const search = params.toString();
                    navigate(search ? `/?${search}` : '/', { replace: true });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = searchQuery.trim();
                    if (location.pathname !== '/') {
                      navigate(val ? `/?q=${encodeURIComponent(val)}` : '/');
                    } else if (!val) {
                      navigate('/');
                    }
                  }
                }}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <div className="text-xs lg:text-sm text-gray-500 hidden lg:block whitespace-nowrap">
              无需注册 · 即用即走
            </div>
            {/* 收藏按钮 */}
            <button
              onClick={() => navigate('/bookmarks')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative group"
              aria-label="我的收藏"
            >
              <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
              {bookmarks.size > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {bookmarks.size}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home tools={TOOLS} />} />
              <Route path="/bookmarks" element={<Bookmarks tools={TOOLS} />} />
              <Route path="/fba-calculator" element={<FBACalculator />} />
              <Route path="/pricing-calculator" element={<PricingCalculator />} />
              <Route path="/acos-calculator" element={<ACoSCalculator />} />
              <Route path="/fba-size-optimizer" element={<FBASizeOptimizer />} />
              <Route path="/timezone-converter" element={<TimezoneConverter />} />
              <Route path="/holiday-calendar" element={<HolidayCalendar />} />
              
              <Route path="/search-term-optimizer" element={<SearchTermOptimizer />} />
              <Route path="/html-editor" element={<HTMLEditor />} />
              <Route path="/listing-compliance" element={<ListingCompliance />} />
              <Route path="/keyword-density" element={<KeywordDensity />} />
              <Route path="/translation" element={<Translation />} />
              <Route path="/description-template" element={<DescriptionTemplate />} />
              
              <Route path="/ppc-wrapper" element={<PPCWrapper />} />
              <Route path="/ab-test-calculator" element={<ABTestCalculator />} />
              <Route path="/pallet-calculator" element={<PalletCalculator />} />
              <Route path="/compliance-checklist" element={<ComplianceChecklist />} />
              <Route path="/barcode-generator" element={<BarcodeGenerator />} />
              <Route path="/inventory-calculator" element={<InventoryCalculator />} />
              
              <Route path="/email-templates" element={<EmailTemplates />} />
              <Route path="/unit-converter" element={<UnitConverter />} />
              <Route path="/exchange-rate" element={<ExchangeRate />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/startup-progress" element={<StartupProgress />} />
              <Route path="/rating-calculator" element={<RatingCalculator />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
