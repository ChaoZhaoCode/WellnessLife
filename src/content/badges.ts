// 徽章定义
export interface Badge {
  id: string;
  name: string;
  description: string;
  condition: string; // 条件描述
  icon: string; // SVG图标名称
  category: string; // 关联的分类
  type: 'series' | 'category'; // 达成类型
}

// 所有徽章定义
export const BADGES: Badge[] = [
  // 系列徽章
  {
    id: 'protein-master',
    name: '蛋白质达人',
    description: '完成了蛋白质系列的学习',
    condition: '学完蛋白质系列',
    icon: 'protein',
    category: 'diet',
    type: 'series',
  },
  {
    id: 'carbs-master',
    name: '碳水专家',
    description: '完成了碳水化合物系列的学习',
    condition: '学完碳水系列',
    icon: 'carbs',
    category: 'diet',
    type: 'series',
  },
  {
    id: 'fat-master',
    name: '脂肪专家',
    description: '学会了区分好脂肪和坏脂肪',
    condition: '学完脂肪系列',
    icon: 'fat',
    category: 'diet',
    type: 'series',
  },
  // 板块徽章
  {
    id: 'diet-expert',
    name: '饮食专家',
    description: '学完了饮食板块的全部内容',
    condition: '学完饮食板块全部',
    icon: 'diet',
    category: 'diet',
    type: 'category',
  },
  {
    id: 'exercise-master',
    name: '运动达人',
    description: '学完了运动板块的全部内容',
    condition: '学完运动板块全部',
    icon: 'exercise',
    category: 'exercise',
    type: 'category',
  },
  {
    id: 'sleep-consultant',
    name: '睡眠顾问',
    description: '学完了睡眠板块的全部内容',
    condition: '学完睡眠板块全部',
    icon: 'sleep',
    category: 'sleep',
    type: 'category',
  },
  {
    id: 'mindset-master',
    name: '心态达人',
    description: '学完了心态板块的全部内容',
    condition: '学完心态板块全部',
    icon: 'mindset',
    category: 'mindset',
    type: 'category',
  },
  {
    id: 'debunk-master',
    name: '谣言粉碎机',
    description: '识破了所有养生谣言',
    condition: '学完辟谣板块全部',
    icon: 'debunk',
    category: 'debunk',
    type: 'category',
  },
];

// 系列名称到徽章ID的映射
export const SERIES_BADGE_MAP: Record<string, string> = {
  '蛋白质入门': 'protein-master',
  '碳水化合物': 'carbs-master',
  '脂肪真相': 'fat-master',
};

// 获取系列徽章
export const getSeriesBadges = (): Badge[] => {
  return BADGES.filter(b => b.type === 'series');
};

// 获取板块徽章
export const getCategoryBadges = (): Badge[] => {
  return BADGES.filter(b => b.type === 'category');
};

// 获取某分类的徽章
export const getBadgesByCategory = (categoryId: string): Badge[] => {
  return BADGES.filter(b => b.category === categoryId);
};

// localStorage 键名
export const STORAGE_KEYS = {
  READ_CARDS: 'wellness-read-cards',
  EARNED_BADGES: 'wellness-earned-badges',
  LAST_READ_DATE: 'wellness-last-read-date',
};

// 检查是否已读
export const isCardRead = (cardId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const readCards = getReadCards();
  return readCards.includes(cardId);
};

// 获取已读卡片列表
export const getReadCards = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READ_CARDS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 标记卡片为已读
export const markCardAsRead = (cardId: string): void => {
  if (typeof window === 'undefined') return;
  const readCards = getReadCards();
  if (!readCards.includes(cardId)) {
    readCards.push(cardId);
    localStorage.setItem(STORAGE_KEYS.READ_CARDS, JSON.stringify(readCards));
  }
};

// 获取已获得的徽章
export const getEarnedBadges = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EARNED_BADGES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 授予徽章
export const awardBadge = (badgeId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const earnedBadges = getEarnedBadges();
  if (!earnedBadges.includes(badgeId)) {
    earnedBadges.push(badgeId);
    localStorage.setItem(STORAGE_KEYS.EARNED_BADGES, JSON.stringify(earnedBadges));
    return true; // 返回true表示是新获得的徽章
  }
  return false;
};

// 检查某系列是否全部读完
export const isSeriesComplete = (seriesName: string, allCards: { id: string; series?: string }[]): boolean => {
  const seriesCards = allCards.filter(c => c.series === seriesName);
  if (seriesCards.length === 0) return false;
  const readCards = getReadCards();
  return seriesCards.every(card => readCards.includes(card.id));
};

// 检查某分类是否全部读完
export const isCategoryComplete = (categoryId: string, allCards: { id: string; categoryId: string }[]): boolean => {
  const categoryCards = allCards.filter(c => c.categoryId === categoryId);
  if (categoryCards.length === 0) return false;
  const readCards = getReadCards();
  return categoryCards.every(card => readCards.includes(card.id));
};

// 检查所有徽章并颁发新徽章
export const checkAndAwardBadges = (
  allCards: { id: string; categoryId: string; series?: string }[]
): string[] => {
  const newBadges: string[] = [];

  // 检查系列徽章
  for (const [seriesName, badgeId] of Object.entries(SERIES_BADGE_MAP)) {
    if (isSeriesComplete(seriesName, allCards)) {
      if (awardBadge(badgeId)) {
        newBadges.push(badgeId);
      }
    }
  }

  // 检查板块徽章
  const categoryBadges = getCategoryBadges();
  for (const badge of categoryBadges) {
    if (isCategoryComplete(badge.category, allCards)) {
      if (awardBadge(badge.id)) {
        newBadges.push(badge.id);
      }
    }
  }

  return newBadges;
};

// 获取读卡进度百分比
export const getReadProgress = (categoryId: string, allCards: { id: string; categoryId: string }[]): number => {
  const categoryCards = allCards.filter(c => c.categoryId === categoryId);
  if (categoryCards.length === 0) return 0;
  const readCards = getReadCards();
  const readCount = categoryCards.filter(card => readCards.includes(card.id)).length;
  return Math.round((readCount / categoryCards.length) * 100);
};

// 获取总体进度
export const getOverallProgress = (allCards: { id: string }[]): { read: number; total: number; percentage: number } => {
  const readCards = getReadCards();
  const read = allCards.filter(c => readCards.includes(c.id)).length;
  return {
    read,
    total: allCards.length,
    percentage: Math.round((read / allCards.length) * 100),
  };
};
