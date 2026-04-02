import { useState, useMemo } from 'react';
import { Star, Info } from 'lucide-react';

export default function RatingCalculator() {
  const [currentRating, setCurrentRating] = useState<number | ''>(3.8);
  const [currentReviews, setCurrentReviews] = useState<number | ''>(50);
  const [targetRating, setTargetRating] = useState<number | ''>(4.3);
  const [newReviewScore, setNewReviewScore] = useState<number>(5);

  const results = useMemo(() => {
    if (currentRating === '' || currentReviews === '' || targetRating === '') return null;
    if (targetRating <= currentRating) return { error: '目标评分必须大于当前评分' };
    if (targetRating >= newReviewScore) return { error: '目标评分必须小于新增评价的平均分' };

    // Formula: (CurrentRating * CurrentReviews + NewScore * X) / (CurrentReviews + X) = TargetRating
    // X = CurrentReviews * (TargetRating - CurrentRating) / (NewScore - TargetRating)
    
    const requiredReviews = (currentReviews * (targetRating - currentRating)) / (newReviewScore - targetRating);
    
    // Calculate a "realistic" number assuming not all new reviews will be 5 stars
    // Assume average of new reviews is 4.8 instead of 5
    const realisticScore = 4.8;
    let realisticReviews = 0;
    if (targetRating < realisticScore) {
      realisticReviews = (currentReviews * (targetRating - currentRating)) / (realisticScore - targetRating);
    }

    return {
      minimum: Math.ceil(requiredReviews),
      realistic: targetRating < realisticScore ? Math.ceil(realisticReviews) : null
    };
  }, [currentRating, currentReviews, targetRating, newReviewScore]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="w-6 h-6 mr-2 text-yellow-500" />
            评价评分计算器
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            计算达到目标星级评分所需的好评数量，制定评价提升计划。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前评分 (1-5)</label>
              <input 
                type="number" min="1" max="5" step="0.1" 
                value={currentRating} onChange={(e) => setCurrentRating(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm border p-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">当前评价总数</label>
              <input 
                type="number" min="1" 
                value={currentReviews} onChange={(e) => setCurrentReviews(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm border p-2.5"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">目标评分</label>
            <input 
              type="number" min="1" max="5" step="0.1" 
              value={targetRating} onChange={(e) => setTargetRating(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm border p-2.5"
            />
            <p className="mt-1 text-xs text-gray-500">亚马逊通常在 4.3 分以上才会有较好的转化率。</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">预估新增评价平均分</label>
            <select 
              value={newReviewScore} onChange={(e) => setNewReviewScore(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm border p-2.5"
            >
              <option value={5}>5 分 (全好评，理想情况)</option>
              <option value={4.5}>4.5 分 (较好情况)</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-6">计算结果</h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {results?.error ? (
              <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg">
                {results.error}
              </div>
            ) : results ? (
              <>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">最少需要新增评价数</p>
                  <p className="text-5xl font-bold text-gray-900">
                    {results.minimum} <span className="text-xl font-normal text-gray-500">个</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    (假设所有新增评价均为 {newReviewScore} 分)
                  </p>
                </div>

                {results.realistic && newReviewScore === 5 && (
                  <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
                    <p className="text-sm text-yellow-800 mb-1">合理预估需要新增</p>
                    <p className="text-2xl font-bold text-yellow-700">{results.realistic} 个</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      (考虑自然留评中可能包含中差评，按平均4.8分计算)
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400">
                请输入完整数据以获取计算结果
              </div>
            )}
          </div>

          <div className="mt-6 bg-gray-50 rounded-md p-4 flex items-start">
            <Info className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium text-gray-700 mb-1">评价提升建议：</p>
              <p>1. 使用亚马逊官方 Request a Review 功能。</p>
              <p>2. 参与 Vine 计划获取高质量早期评论。</p>
              <p>3. 优化产品质量和包装，从根本上减少差评。</p>
              <p className="text-red-500 mt-2">警告：切勿使用刷单、好评返现等违规手段，极易导致封号。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
