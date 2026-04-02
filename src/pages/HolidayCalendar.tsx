import { useState } from 'react';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';

// Mock data for holidays
const HOLIDAYS = [
  { id: 1, date: '2026-05-10', name: '母亲节 (Mother\'s Day)', country: 'US, UK, DE', impact: 'high', advice: '提前1个月备货，优化礼品类关键词' },
  { id: 2, date: '2026-05-25', name: '阵亡将士纪念日 (Memorial Day)', country: 'US', impact: 'medium', advice: '夏季产品促销好时机' },
  { id: 3, date: '2026-06-21', name: '父亲节 (Father\'s Day)', country: 'US, UK', impact: 'high', advice: '男士礼品、工具类产品提前备货' },
  { id: 4, date: '2026-07-04', name: '独立日 (Independence Day)', country: 'US', impact: 'medium', advice: '户外、派对用品热销，注意物流可能延误' },
  { id: 5, date: '2026-07-15', name: 'Prime Day (预计)', country: 'Global', impact: 'critical', advice: '全年最大流量节点，提前2个月入仓，备足预算' },
];

export default function HolidayCalendar() {
  const [country, setCountry] = useState('US');
  const [month, setMonth] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-red-500" />
            全球节假日查询
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            查询各站点法定节假日及亚马逊促销节点，提前规划运营。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">国家/站点</label>
          <select 
            value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-48 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2"
          >
            <option value="US">美国 (US)</option>
            <option value="UK">英国 (UK)</option>
            <option value="DE">德国 (DE)</option>
            <option value="Global">全球通用</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月份</label>
          <select 
            value={month} onChange={(e) => setMonth(e.target.value)}
            className="w-32 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2"
          >
            <option value="all">全年</option>
            <option value="05">5月</option>
            <option value="06">6月</option>
            <option value="07">7月</option>
          </select>
        </div>

        <button className="flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          筛选
        </button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">节日名称</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影响程度</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">运营建议</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {HOLIDAYS.map((holiday) => (
              <tr key={holiday.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {holiday.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {holiday.name}
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {holiday.country}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    holiday.impact === 'critical' ? 'bg-red-100 text-red-800' :
                    holiday.impact === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.impact === 'critical' ? '极高 (大促)' : holiday.impact === 'high' ? '高 (流量节点)' : '中 (常规节日)'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {holiday.advice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
