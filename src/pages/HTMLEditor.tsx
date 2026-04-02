import { useState } from 'react';
import { Code, Bold, Type, Copy, Check, Eye } from 'lucide-react';

export default function HTMLEditor() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + openTag + selectedText + closeTag + text.substring(end);
    setText(newText);
    
    // Reset focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, end + openTag.length);
    }, 0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Code className="w-6 h-6 mr-2 text-orange-500" />
            亚马逊专属 HTML 编辑器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            仅支持亚马逊允许的 HTML 标签，一键排版，拒绝乱码。
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => insertTag('<b>', '</b>')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              title="加粗 (Bold)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertTag('<br>', '')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors flex items-center text-sm font-medium"
              title="换行 (Line Break)"
            >
              BR
            </button>
            <button
              onClick={() => insertTag('<p>', '</p>')}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              title="段落 (Paragraph)"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${mode === 'edit' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              编辑代码
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center ${mode === 'preview' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              预览效果
            </button>
          </div>
        </div>

        <div className="p-0 h-[400px]">
          {mode === 'edit' ? (
            <textarea
              id="html-editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full p-4 border-0 focus:ring-0 resize-none font-mono text-sm text-gray-800"
              placeholder="在此输入产品描述...&#10;选中文字后点击上方按钮添加标签。"
            />
          ) : (
            <div 
              className="w-full h-full p-4 overflow-y-auto prose max-w-none"
              dangerouslySetInnerHTML={{ __html: text || '<span class="text-gray-400">暂无内容</span>' }}
            />
          )}
        </div>
        
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            提示：亚马逊仅允许使用少数标签，如 &lt;b&gt;, &lt;br&gt;, &lt;p&gt;。请勿使用其他复杂标签。
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? '已复制' : '复制代码'}
          </button>
        </div>
      </div>
    </div>
  );
}
