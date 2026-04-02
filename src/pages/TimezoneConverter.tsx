import { useState, useEffect } from 'react';
import { Globe, Clock } from 'lucide-react';

const TIMEZONES = [
  { id: 'Asia/Shanghai', name: '中国时间 (北京)', abbr: 'CST' },
  { id: 'America/Los_Angeles', name: '美国太平洋时间 (洛杉矶)', abbr: 'PST/PDT' },
  { id: 'America/New_York', name: '美国东部时间 (纽约)', abbr: 'EST/EDT' },
  { id: 'Europe/London', name: '英国时间 (伦敦)', abbr: 'GMT/BST' },
  { id: 'Europe/Berlin', name: '欧洲中部时间 (德国/法国)', abbr: 'CET/CEST' },
  { id: 'Asia/Tokyo', name: '日本时间 (东京)', abbr: 'JST' },
];

export default function TimezoneConverter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [baseTz, setBaseTz] = useState('Asia/Shanghai');
  const [targetTz, setTargetTz] = useState('America/Los_Angeles');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(date);
    } catch (e) {
      return 'Invalid Timezone';
    }
  };

  const formatDate = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-indigo-600" />
            时区转换器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            快速转换中国与亚马逊各站点时区，自动适配夏令时。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-400" />
            实时时间对比
          </h3>
          
          <div className="space-y-6">
            {TIMEZONES.slice(0, 4).map((tz) => (
              <div key={tz.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{tz.name}</p>
                  <p className="text-sm text-gray-500">{tz.abbr}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 font-mono">
                    {formatTime(currentTime, tz.id)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentTime, tz.id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">自定义转换</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">基准时区</label>
              <select 
                value={baseTz} onChange={(e) => setBaseTz(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.id} value={tz.id}>{tz.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标时区</label>
              <select 
                value={targetTz} onChange={(e) => setTargetTz(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.id} value={tz.id}>{tz.name}</option>
                ))}
              </select>
            </div>

            <div className="mt-8 p-5 bg-indigo-50 rounded-lg border border-indigo-100 text-center">
              <p className="text-sm text-indigo-600 mb-2">当前对应时间</p>
              <p className="text-3xl font-bold text-indigo-900 font-mono">
                {formatTime(currentTime, targetTz).substring(0, 5)}
              </p>
              <p className="text-sm text-indigo-700 mt-1">
                {formatDate(currentTime, targetTz)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
