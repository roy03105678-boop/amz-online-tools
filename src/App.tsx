import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  DollarSign, 
  Globe, 
  Calendar, 
  CheckSquare, 
  Search, 
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
  Sun,
  Moon
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from './lib/utils';

// Tool Components
import Home from './pages/Home';
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

function Sidebar({ isOpen, setIsOpen, searchQuery, setSearchQuery }: { 
  isOpen: boolean, 
  setIsOpen: (v: boolean) => void,
  searchQuery: string,
  setSearchQuery: (v: string) => void
}) {
  const location = useLocation();

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    return TOOLS.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderToolLinks = (priority: number) => {
    const tools = filteredTools.filter(t => t.priority === priority);
    if (tools.length === 0) return null;

    const titles: Record<number, string> = {
      1: '核心生存工具',
      2: 'Listing优化',
      3: '合规与效率',
      4: '增值服务'
    };

    return (
      <>
        <div className="px-3 mb-2 mt-4 first:mt-0">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{titles[priority]}</p>
        </div>
        <nav className="space-y-1 px-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                location.pathname === tool.path 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <tool.icon className={cn(
                "mr-3 flex-shrink-0 h-5 w-5",
                location.pathname === tool.path ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
              )} />
              {tool.name}
            </Link>
          ))}
        </nav>
      </>
    );
  };

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
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600 dark:text-blue-400" onClick={() => setIsOpen(false)}>
            <Package className="w-6 h-6" />
            <span>AMZ Toolkit</span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input in Sidebar */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {renderToolLinks(1)}
          {renderToolLinks(2)}
          {renderToolLinks(3)}
          {renderToolLinks(4)}
          {filteredTools.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              未找到相关工具
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 lg:px-8 justify-between transition-colors">
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">亚马逊卖家工具箱</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="切换主题"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden xs:block">
              无需注册 · 即用即走
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<Home tools={TOOLS} searchQuery={searchQuery} />} />
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
