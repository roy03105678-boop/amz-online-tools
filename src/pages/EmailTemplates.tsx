import { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'review',
    name: '合规索评 (Review Request)',
    subject: 'Following up on your Amazon order [Order ID]',
    body: `Dear Customer,

Thank you for purchasing [Product Name] from our store. We hope you are enjoying it!

As a small business, your feedback is incredibly important to us. If you have a moment, we would greatly appreciate it if you could share your experience by leaving a product review on Amazon.

You can leave a review here:
[Link to Review Page]

If you have any issues or questions about your order, please reply directly to this email. We are always here to help.

Best regards,
[Your Brand Name] Customer Service`
  },
  {
    id: 'shipping',
    name: '发货通知 (Shipping Update)',
    subject: 'Your order [Order ID] has been shipped!',
    body: `Hi there,

Great news! Your order for [Product Name] has been shipped and is on its way to you.

You can track your package directly through your Amazon account. If you have any questions about the delivery, please let us know.

Thank you for shopping with [Your Brand Name].

Best regards,
[Your Brand Name] Team`
  },
  {
    id: 'refund',
    name: '退款处理 (Refund Processed)',
    subject: 'Update regarding your order [Order ID]',
    body: `Dear Customer,

We are writing to confirm that a full refund has been processed for your order of [Product Name]. 

Please allow 3-5 business days for the funds to appear on your original payment method, depending on your bank's processing time.

We apologize that the product did not meet your expectations this time. If you have any further questions, please feel free to reach out.

Best regards,
[Your Brand Name] Customer Support`
  }
];

export default function EmailTemplates() {
  const [activeTab, setActiveTab] = useState(TEMPLATES[0].id);
  const [orderId, setOrderId] = useState('114-1234567-8901234');
  const [productName, setProductName] = useState('Wireless Gaming Mouse');
  const [brandName, setBrandName] = useState('TechGear');
  const [copied, setCopied] = useState(false);

  const activeTemplate = TEMPLATES.find(t => t.id === activeTab)!;

  const getProcessedText = (text: string) => {
    return text
      .replace(/\[Order ID\]/g, orderId || '[Order ID]')
      .replace(/\[Product Name\]/g, productName || '[Product Name]')
      .replace(/\[Your Brand Name\]/g, brandName || '[Your Brand Name]');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getProcessedText(activeTemplate.subject) + '\n\n' + getProcessedText(activeTemplate.body));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="w-6 h-6 mr-2 text-teal-600" />
            合规客服邮件模板
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            100% 符合亚马逊 TOS 政策的安全邮件模板，避免违规封号。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-3">变量设置</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">订单号 [Order ID]</label>
                <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">产品名称 [Product Name]</label>
                <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">品牌名称 [Brand Name]</label>
                <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} className="w-full rounded-md border-gray-300 sm:text-sm border p-2" />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">选择场景</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${activeTab === t.id ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col">
            <div className="border-b border-gray-200 px-5 py-4 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">邮件预览</h3>
              <button
                onClick={handleCopy}
                className="flex items-center text-sm text-teal-600 hover:text-teal-700"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? '已复制' : '复制全部'}
              </button>
            </div>
            <div className="p-5 flex-1">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Subject</span>
                <p className="mt-1 text-gray-900 font-medium">{getProcessedText(activeTemplate.subject)}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Body</span>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                  {getProcessedText(activeTemplate.body)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
