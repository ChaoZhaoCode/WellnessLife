// 卡片分类定义
export const CATEGORIES = {
  diet: {
    id: 'diet',
    name: '饮食',
    nameJa: '食事',
    icon: '🍽️',
    color: '#F59E0B',
    description: '好好吃饭，是最好的养生',
    cards: [] as Card[],
  },
  exercise: {
    id: 'exercise',
    name: '运动',
    nameJa: '運動',
    icon: '🧘',
    color: '#3B82F6',
    description: '动一动，身体更年轻',
    cards: [] as Card[],
  },
  sleep: {
    id: 'sleep',
    name: '睡眠',
    nameJa: '睡眠',
    icon: '😴',
    color: '#8B5CF6',
    description: '睡得好，身体才能修复',
    cards: [] as Card[],
  },
  mindset: {
    id: 'mindset',
    name: '心态',
    nameJa: '心態',
    icon: '🌸',
    color: '#EC4899',
    description: '心情好，一切都顺',
    cards: [] as Card[],
  },
  debunk: {
    id: 'debunk',
    name: '辟谣',
    nameJa: 'デマ撃退',
    icon: '🚫',
    color: '#EF4444',
    description: '打破养生谣言',
    cards: [] as Card[],
  },
} as const;

export type CategoryId = keyof typeof CATEGORIES;

export interface Card {
  id: string;
  categoryId: CategoryId;
  title: string;
  titleJa?: string;
  content: string;
  actionTip: string;
  dataPoint?: {
    value: string;
    description: string;
  };
  relatedIcon: string;
  tags: string[];
  series?: string;
  readTime: number; // 秒
}

// 分类汇总
export const getCategoryCards = (categoryId: CategoryId): Card[] => {
  return CATEGORIES[categoryId].cards;
};

// 随机获取一张卡片（今日推荐用）
export const getRandomCard = (): Card => {
  const allCards = Object.values(CATEGORIES).flatMap(cat => cat.cards);
  return allCards[Math.floor(Math.random() * allCards.length)];
};

// 获取所有卡片
export const getAllCards = (): Card[] => {
  return Object.values(CATEGORIES).flatMap(cat => cat.cards);
};