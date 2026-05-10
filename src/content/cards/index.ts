// 汇总所有卡片
import { Card, CategoryId } from './category';
import { dietCards } from './diet-cards';
import { exerciseCards } from './exercise-cards';
import { sleepBasicsCards } from './sleep-basics';
import { dietDebunkCards } from './diet-debunk';

// 所有卡片汇总（暂时移除心态板块）
export const allCards: Card[] = [
  ...dietCards,
  ...exerciseCards,
  ...sleepBasicsCards,
  ...dietDebunkCards,
];

// 导出各分类卡片
export {
  dietCards,
  exerciseCards,
  sleepBasicsCards,
  dietDebunkCards,
};

// 根据分类获取卡片
export const getCardsByCategory = (categoryId: CategoryId): Card[] => {
  return allCards.filter(card => card.categoryId === categoryId);
};

// 根据ID获取单张卡片
export const getCardById = (id: string): Card | undefined => {
  return allCards.find(card => card.id === id);
};

// 获取系列卡片
export const getCardsBySeries = (series: string): Card[] => {
  return allCards.filter(card => card.series === series);
};

// 获取随机卡片（排除已读的）
export const getRandomUnreadCard = (readIds: string[] = []): Card | undefined => {
  const unreadCards = allCards.filter(card => !readIds.includes(card.id));
  if (unreadCards.length === 0) return allCards[0];
  return unreadCards[Math.floor(Math.random() * unreadCards.length)];
};

// 统计信息
export const cardStats = {
  total: allCards.length,
  byCategory: {
    diet: dietCards.length,
    exercise: exerciseCards.length,
    sleep: sleepBasicsCards.length,
    debunk: dietDebunkCards.length,
  },
  summary: `饮食${dietCards.length}张 / 运动${exerciseCards.length}张 / 睡眠${sleepBasicsCards.length}张 / 辟谣${dietDebunkCards.length}张（共${allCards.length}张）`,
};

// 导出类别定义
export { CATEGORIES } from './category';
export type { Card, CategoryId } from './category';