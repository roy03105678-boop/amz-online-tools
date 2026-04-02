import { useState } from 'react';
import { Map, CheckCircle2, Circle } from 'lucide-react';

const PROGRESS_STEPS = [
  {
    id: 's1',
    title: '准备注册材料',
    time: '预计 1-3 天',
    materials: ['营业执照正副本扫描件', '法定代表人身份证正反面', '双币信用卡 (Visa/MasterCard)', '收款账户 (如万里汇、派安盈)', '干净的电脑和网络环境'],
    checked: false
  },
  {
    id: 's2',
    title: '提交注册申请',
    time: '预计 1 天',
    materials: ['填写公司信息', '填写法人信息', '绑定信用卡与收款账户', '完成身份验证 (视频通话或拍照)'],
    checked: false
  },
  {
    id: 's3',
    title: '资质审核 (二审/KYC)',
    time: '预计 3-14 天',
    materials: ['可能需要提供：水电煤账单 (带有公司名称或法人名称及地址)', '营业执照公证书 (部分欧洲站)'],
    checked: false
  },
  {
    id: 's4',
    title: '店铺基础设置',
    time: '预计 1 天',
    materials: ['设置退货地址', '设置运费模板 (自发货)', '填写税务信息 (Tax Interview)', '完善卖家资料 (Storefront)'],
    checked: false
  },
  {
    id: 's5',
    title: '品牌备案 (强烈建议)',
    time: '预计 7-30 天',
    materials: ['商标注册号或申请回执 (TM标)', '带有品牌Logo的产品图片', '带有品牌Logo的包装图片'],
    checked: false
  },
  {
    id: 's6',
    title: '上架首款产品 (Listing)',
    time: '预计 1-3 天',
    materials: ['UPC/EAN条码', '产品主图与辅图', '优化好的标题、五点描述、产品描述', '产品尺寸与重量信息'],
    checked: false
  },
  {
    id: 's7',
    title: '发货至FBA仓库',
    time: '预计 15-40 天',
    materials: ['创建发货计划', '打印并粘贴产品标签 (FNSKU)', '打印并粘贴外箱标签', '联系货代发货并填入物流单号'],
    checked: false
  }
];

export default function StartupProgress() {
  const [steps, setSteps] = useState(PROGRESS_STEPS);

  const toggleStep = (id: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, checked: !step.checked } : step
    ));
  };

  const completedCount = steps.filter(s => s.checked).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Map className="w-6 h-6 mr-2 text-blue-600" />
            新卖家开店进度表
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            引导完成亚马逊开店全流程，明确各步骤所需材料。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-gray-700">整体进度</p>
              <p className="text-2xl font-bold text-blue-600">{progressPercent}%</p>
            </div>
            <p className="text-sm text-gray-500">已完成 {completedCount} / {steps.length} 步</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative pl-8">
              <button 
                onClick={() => toggleStep(step.id)}
                className="absolute -left-[11px] top-1 bg-white"
              >
                {step.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 bg-white" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 bg-white hover:text-blue-400" />
                )}
              </button>
              
              <div className={`transition-opacity ${step.checked ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className={`text-lg font-medium ${step.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {idx + 1}. {step.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1 sm:mt-0 w-fit">
                    {step.time}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-md p-4 border border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">所需材料/操作：</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                    {step.materials.map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
