'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { allCards, CATEGORIES, type Card, type CategoryId } from '@/content/cards';
import {
  BADGES,
  getEarnedBadges,
  markCardAsRead,
  checkAndAwardBadges,
  getReadProgress,
  getOverallProgress,
  type Badge
} from '@/content/badges';
import './health-cards.css';

// Lucide 图标组件
const IconRenderer = ({ iconName, size = 36 }: { iconName: string; size?: number }) => {
  // 简化的 SVG 图标 - 符合 UI/UX Pro Max 规范：无 emoji，使用 SVG
  const icons: Record<string, JSX.Element> = {
    'egg': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <ellipse cx="40" cy="42" rx="20" ry="24" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2"/>
        <circle cx="40" cy="44" r="10" fill="#F59E0B"/>
        <circle cx="37" cy="41" r="3" fill="#FCD34D" opacity="0.6"/>
      </svg>
    ),
    'rice-bowl': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <ellipse cx="40" cy="50" rx="25" ry="8" fill="#E5E7EB"/>
        <path d="M15 50 Q15 35 40 35 Q65 35 65 50" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2"/>
        <ellipse cx="40" cy="50" rx="25" ry="8" fill="#FAFAFA"/>
        <circle cx="30" cy="45" r="2" fill="#F3F4F6"/>
        <circle cx="40" cy="42" r="2" fill="#F3F4F6"/>
        <circle cx="50" cy="46" r="2" fill="#F3F4F6"/>
      </svg>
    ),
    'meat': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <path d="M25 55 L30 25 L50 25 L55 55 Q40 65 25 55Z" fill="#F87171" stroke="#EF4444" strokeWidth="2"/>
        <path d="M32 35 Q40 32 48 35" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round"/>
        <path d="M31 45 Q40 42 49 45" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    'tofu': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <rect x="22" y="25" width="36" height="30" rx="4" fill="#FAFAFA" stroke="#D1D5DB" strokeWidth="2"/>
        <line x1="28" y1="35" x2="52" y2="35" stroke="#E5E7EB" strokeWidth="1.5"/>
        <line x1="28" y1="42" x2="52" y2="42" stroke="#E5E7EB" strokeWidth="1.5"/>
        <circle cx="30" cy="30" r="1.5" fill="#92400E"/>
        <circle cx="42" cy="28" r="1.5" fill="#92400E"/>
        <circle cx="50" cy="32" r="1.5" fill="#92400E"/>
      </svg>
    ),
    'fish': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <ellipse cx="38" cy="40" rx="22" ry="14" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <path d="M55 40 L68 28 L68 52 Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2"/>
        <path d="M35 26 L42 20 L48 26" fill="#60A5FA"/>
        <circle cx="22" cy="38" r="4" fill="#FFFFFF" stroke="#1E40AF" strokeWidth="1.5"/>
        <circle cx="22" cy="38" r="2" fill="#1E40AF"/>
      </svg>
    ),
    'milk': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FEF3C7"/>
        <path d="M25 55 L28 30 L52 30 L55 55 Q40 60 25 55Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2"/>
        <ellipse cx="40" cy="32" rx="12" ry="4" fill="#F9FAFB"/>
        <rect x="43" y="15" width="4" height="25" rx="2" fill="#60A5FA"/>
        <rect x="43" y="15" width="4" height="8" rx="2" fill="#3B82F6"/>
      </svg>
    ),
    'exercise': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#DBEAFE"/>
        <circle cx="40" cy="28" r="6" fill="#3B82F6"/>
        <path d="M40 34 L40 52" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 38 L28 46" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 38 L52 46" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 52 L32 64" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
        <path d="M40 52 L48 64" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
    'sleep': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#EDE9FE"/>
        <path d="M50 25 C50 25 45 35 35 35 C25 35 20 25 20 25" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round"/>
        <path d="M45 32 C45 32 42 38 35 38 C28 38 25 32 25 32" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="30" cy="28" r="2" fill="#8B5CF6"/>
        <circle cx="38" cy="24" r="1.5" fill="#A78BFA"/>
        <circle cx="44" cy="28" r="1" fill="#C4B5FD"/>
      </svg>
    ),
    'mindset': (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <circle cx="40" cy="40" r="35" fill="#FCE7F3"/>
        <path d="M40 55 C40 55 25 45 25 35 C25 28 32 22 40 22 C48 22 55 28 55 35 C55 45 40 55 40 55Z" fill="#EC4899"/>
        <path d="M40 45 C40 45 35 40 35 36 C35 33 38 30 40 30 C42 30 45 33 45 36 C45 40 40 45 40 45Z" fill="#F472B6"/>
      </svg>
    ),
  };

  return icons[iconName] || icons['exercise'];
};

// 分类图标
const CategoryIcon = ({ categoryId, size = 20 }: { categoryId: string; size?: number }) => {
  const icons: Record<string, JSX.Element> = {
    diet: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    exercise: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <circle cx="12" cy="5" r="3"/>
        <path d="M12 8v8"/>
        <path d="M8 12h8"/>
        <path d="M12 16l-4 4"/>
        <path d="M12 16l4 4"/>
      </svg>
    ),
    sleep: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
    mindset: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    debunk: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  };

  return icons[categoryId] || icons['diet'];
};

// 行动建议图标
const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M12 2v1"/>
    <path d="M4.93 4.93l.7.7"/>
    <path d="M2 12h1"/>
    <path d="M19.07 4.93l-.7.7"/>
    <path d="M22 12h-1"/>
    <path d="M12 8a4 4 0 0 1 4 4"/>
    <path d="M12 8a4 4 0 0 0-4 4"/>
    <path d="M12 12a4 4 0 0 0 4 4"/>
    <path d="M12 12a4 4 0 0 1-4 4"/>
  </svg>
);

// 目录图标
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// 关闭图标
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// 目录图标（大）
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

// 左箭头图标
const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// 徽章图标
const BadgeIcon = ({ type = 'default' }: { type?: 'gold' | 'silver' | 'bronze' | 'default' }) => {
  const colors = {
    gold: { bg: '#FEF3C7', border: '#F59E0B', star: '#F59E0B' },
    silver: { bg: '#F1F5F9', border: '#94A3B8', star: '#94A3B8' },
    bronze: { bg: '#FEF2F2', border: '#B45309', star: '#B45309' },
    default: { bg: '#E0F2FE', border: '#0891B2', star: '#0891B2' },
  };
  const c = colors[type];

  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="12" cy="12" r="10" fill={c.bg} stroke={c.border} strokeWidth="1.5"/>
      <path d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14L8 17L9.5 12.5L6 10H10.5L12 6Z" fill={c.star}/>
    </svg>
  );
};

// 已获得徽章图标（带勾）
const BadgeEarnedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="12" r="10" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5"/>
    <path d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14L8 17L9.5 12.5L6 10H10.5L12 6Z" fill="#059669"/>
    <circle cx="18" cy="6" r="5" fill="#059669"/>
    <path d="M15.5 6L17 7.5L20.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 未获得徽章图标（灰色）
const BadgeLockedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
    <circle cx="12" cy="12" r="10" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.6"/>
    <path d="M12 6L13.5 10H18L14.5 12.5L16 17L12 14L8 17L9.5 12.5L6 10H10.5L12 6Z" fill="#CBD5E1" opacity="0.6"/>
  </svg>
);

// 进度图标
const ProgressIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);

// 星星图标
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

// 搜索图标
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// 清除搜索图标
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// 右箭头图标
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// 卡片组件
const CardItem = ({ card }: { card: Card }) => {
  const category = CATEGORIES[card.categoryId];

  return (
    <div className="health-card" style={{ borderLeftColor: category.color }}>
      <div className="card-header">
        <div className="card-icon">
          <IconRenderer iconName={card.relatedIcon} />
        </div>
        <div className="card-meta">
          <span className="card-series">{card.series || category.name}</span>
          <span className="card-time">{card.readTime}秒阅读</span>
        </div>
      </div>

      <h3 className="card-title">{card.title}</h3>

      <div className="card-content">
        {card.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {card.dataPoint && (
        <div className="card-data-point">
          <span className="data-value">{card.dataPoint.value}</span>
          <span className="data-desc">{card.dataPoint.description}</span>
        </div>
      )}

      <div className="card-action">
        <span className="action-label">
          <LightbulbIcon />
          行动建议
        </span>
        <p className="action-text">{card.actionTip}</p>
      </div>
    </div>
  );
};

// 徽章展示组件
const BadgeModal = ({
  badges,
  earnedBadges,
  onClose,
  allCards
}: {
  badges: Badge[];
  earnedBadges: string[];
  onClose: () => void;
  allCards: Card[];
}) => {
  const overall = getOverallProgress(allCards);

  return (
    <div className="badge-overlay" onClick={onClose}>
      <div className="badge-panel" onClick={e => e.stopPropagation()}>
        <div className="badge-header">
          <h2>
            <StarIcon />
            我的成就
          </h2>
          <button className="badge-close" onClick={onClose}>
            <XIcon />
          </button>
        </div>

        {/* 总体进度 */}
        <div className="badge-overall-progress">
          <div className="progress-circle">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeDasharray={`${overall.percentage}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891B2"/>
                  <stop offset="100%" stopColor="#22D3EE"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="progress-text">{overall.percentage}%</span>
          </div>
          <div className="progress-info">
            <span className="progress-label">学习进度</span>
            <span className="progress-count">已学习 {overall.read} / {overall.total} 张</span>
          </div>
        </div>

        {/* 板块进度 */}
        <div className="badge-category-progress">
          {Object.values(CATEGORIES).map(cat => {
            const progress = getReadProgress(cat.id, allCards);
            return (
              <div key={cat.id} className="category-progress-item">
                <span className="category-name" style={{ color: cat.color }}>{cat.name}</span>
                <div className="category-progress-bar">
                  <div
                    className="category-progress-fill"
                    style={{ width: `${progress}%`, backgroundColor: cat.color }}
                  />
                </div>
                <span className="category-progress-text">{progress}%</span>
              </div>
            );
          })}
        </div>

        {/* 徽章列表 */}
        <div className="badge-list-section">
          <h3 className="badge-list-title">已获得徽章</h3>
          {earnedBadges.length === 0 ? (
            <p className="badge-empty">继续学习，解锁更多徽章！</p>
          ) : (
            <div className="badge-grid">
              {BADGES.map(badge => (
                <div
                  key={badge.id}
                  className={`badge-item ${earnedBadges.includes(badge.id) ? 'earned' : 'locked'}`}
                >
                  <div className="badge-icon">
                    {earnedBadges.includes(badge.id) ? (
                      <BadgeEarnedIcon />
                    ) : (
                      <BadgeLockedIcon />
                    )}
                  </div>
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-condition">{badge.condition}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 获得新徽章弹窗
const NewBadgeCelebration = ({
  badge,
  onClose
}: {
  badge: Badge;
  onClose: () => void;
}) => {
  return (
    <div className="celebration-overlay" onClick={onClose}>
      <div className="celebration-content" onClick={e => e.stopPropagation()}>
        <div className="celebration-icon">
          <BadgeEarnedIcon />
        </div>
        <h2 className="celebration-title">🎉 徽章获得！</h2>
        <p className="celebration-badge-name">{badge.name}</p>
        <p className="celebration-desc">{badge.description}</p>
        <button className="celebration-btn" onClick={onClose}>
          太棒了！
        </button>
      </div>
    </div>
  );
};

// 目录组件
const TableOfContents = ({
  cards,
  currentIndex,
  onSelect,
  onClose
}: {
  cards: Card[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) => {
  // 按系列分组
  const groupedCards = cards.reduce((acc, card, index) => {
    const series = card.series || '其他';
    if (!acc[series]) {
      acc[series] = [];
    }
    acc[series].push({ ...card, index });
    return acc;
  }, {} as Record<string, (Card & { index: number })[]>);

  return (
    <div className="toc-overlay" onClick={onClose}>
      <div className="toc-panel" onClick={e => e.stopPropagation()}>
        <div className="toc-header">
          <h2>
            <BookIcon />
            目录
          </h2>
          <button className="toc-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="toc-content">
          {Object.entries(groupedCards).map(([series, seriesCards]) => (
            <div key={series} className="toc-section">
              <h3 className="toc-section-title">{series}</h3>
              {seriesCards.map(card => (
                <button
                  key={card.id}
                  className={`toc-item ${card.index === currentIndex ? 'active' : ''}`}
                  onClick={() => onSelect(card.index)}
                >
                  <span className="toc-item-icon">
                    <IconRenderer iconName={card.relatedIcon} size={24} />
                  </span>
                  <span className="toc-item-title">{card.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function HealthCardsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 只显示有卡片的分类
  const categories = Object.values(CATEGORIES).filter(
    cat => allCards.filter(c => c.categoryId === cat.id).length > 0
  );

  // 搜索过滤逻辑
  const searchCards = useCallback((query: string) => {
    if (!query.trim()) return allCards;
    const lowerQuery = query.toLowerCase();
    return allCards.filter(card =>
      card.title.toLowerCase().includes(lowerQuery) ||
      card.content.toLowerCase().includes(lowerQuery) ||
      card.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (card.series && card.series.toLowerCase().includes(lowerQuery))
    );
  }, []);

  const filteredCards = searchQuery.trim()
    ? searchCards(searchQuery)
    : (activeCategory === 'all' ? allCards : allCards.filter(card => card.categoryId === activeCategory));

  // 初始化加载已获得徽章
  useEffect(() => {
    setEarnedBadges(getEarnedBadges());
  }, []);

  // 标记当前卡片为已读并检查徽章
  useEffect(() => {
    if (filteredCards.length > 0 && filteredCards[currentCardIndex]) {
      const card = filteredCards[currentCardIndex];
      const prevEarnedCount = earnedBadges.length;
      markCardAsRead(card.id);

      // 检查是否获得新徽章
      const newBadges = checkAndAwardBadges(allCards);
      const currentEarned = getEarnedBadges();

      // 只有当有新的徽章时更新状态
      if (currentEarned.length > prevEarnedCount) {
        setEarnedBadges(currentEarned);
        // 找出刚获得的徽章
        const justEarned = currentEarned.filter(b => !earnedBadges.includes(b));
        if (justEarned.length > 0) {
          const badge = BADGES.find(b => b.id === justEarned[0]);
          if (badge) {
            setNewBadge(badge);
          }
        }
      }
    }
  }, [currentCardIndex, filteredCards, earnedBadges]);

  // 搜索时重置索引
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentCardIndex(0);
    if (query.trim()) {
      setActiveCategory('all');
    }
    setTimeout(() => scrollToCard(0), 100);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentCardIndex(0);
    setTimeout(() => scrollToCard(0), 100);
  };

  // 滚动到指定卡片
  const scrollToCard = useCallback((index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * (cardWidth + 16), // 16px gap
        behavior: 'smooth'
      });
    }
  }, []);

  // 分类切换时重置
  const handleCategoryChange = (categoryId: CategoryId | 'all') => {
    setActiveCategory(categoryId);
    setCurrentCardIndex(0);
    setShowToc(false);
    setTimeout(() => scrollToCard(0), 100);
  };

  // 从目录选择
  const handleTocSelect = (index: number) => {
    setCurrentCardIndex(index);
    setShowToc(false);
    setTimeout(() => scrollToCard(index), 100);
  };

  // 监听滚动
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth + 16;
    const newIndex = Math.round(scrollRef.current.scrollLeft / cardWidth);
    if (newIndex !== currentCardIndex && newIndex >= 0 && newIndex < filteredCards.length) {
      setCurrentCardIndex(newIndex);
    }
  };

  // 上一张
  const goToPrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      scrollToCard(currentCardIndex - 1);
    }
  };

  // 下一张
  const goToNext = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      scrollToCard(currentCardIndex + 1);
    }
  };

  return (
    <div className="health-page">
      {/* 头部 */}
      <header className="page-header">
        <h1>养生知识</h1>
        <p className="subtitle">每天学一点，健康多一点</p>
      </header>

      {/* 搜索栏 */}
      <div className="search-bar">
        <SearchIcon />
        <input
          type="text"
          className="search-input"
          placeholder="搜索关键词..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={clearSearch}>
            <XIcon />
          </button>
        )}
      </div>

      {/* 分类导航 */}
      <nav className="category-nav">
        <button
          className={`category-tag all ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          <span className="cat-icon">
            <CategoryIcon categoryId="diet" />
          </span>
          <span className="cat-name">全部</span>
          <span className="cat-count">{allCards.length}</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tag ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
            style={{ '--cat-color': cat.color } as React.CSSProperties}
          >
            <span className="cat-icon">
              <CategoryIcon categoryId={cat.id} />
            </span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">{allCards.filter(c => c.categoryId === cat.id).length}</span>
          </button>
        ))}
      </nav>

      {/* 搜索结果提示 */}
      {searchQuery && (
        <div className="search-results-info">
          找到 {filteredCards.length} 条相关知识
        </div>
      )}

      {/* 快捷操作栏 */}
      <div className="quick-actions">
        <button className="toc-toggle" onClick={() => setShowToc(true)}>
          <MenuIcon />
          目录
        </button>
        <button className="badge-toggle" onClick={() => setShowBadges(true)}>
          <StarIcon />
          徽章
          {earnedBadges.length > 0 && (
            <span className="badge-count">{earnedBadges.length}</span>
          )}
        </button>
      </div>

      {/* 进度指示 */}
      <div className="progress-info">
        <span>第 {currentCardIndex + 1} / {filteredCards.length} 张</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 卡片滑动区 */}
      <div className="card-scroll-container">
        <div
          ref={scrollRef}
          className="card-scroll-wrapper"
          onScroll={handleScroll}
        >
          {filteredCards.map((card, index) => (
            <div key={card.id} className="card-scroll-item">
              <CardItem card={card} />
            </div>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="card-nav">
        <button
          className="nav-btn prev"
          onClick={goToPrev}
          disabled={currentCardIndex === 0}
        >
          <ChevronLeftIcon />
          上一篇
        </button>
        <button
          className="nav-btn next"
          onClick={goToNext}
          disabled={currentCardIndex === filteredCards.length - 1}
        >
          下一篇
          <ChevronRightIcon />
        </button>
      </div>

      {/* 目录弹窗 */}
      {showToc && (
        <TableOfContents
          cards={filteredCards}
          currentIndex={currentCardIndex}
          onSelect={handleTocSelect}
          onClose={() => setShowToc(false)}
        />
      )}

      {/* 徽章弹窗 */}
      {showBadges && (
        <BadgeModal
          badges={BADGES}
          earnedBadges={earnedBadges}
          onClose={() => setShowBadges(false)}
          allCards={allCards}
        />
      )}

      {/* 新徽章庆祝弹窗 */}
      {newBadge && (
        <NewBadgeCelebration
          badge={newBadge}
          onClose={() => setNewBadge(null)}
        />
      )}
    </div>
  );
}
