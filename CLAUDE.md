# CLAUDE.md — 长寿养生项目 AI 助手指南

> 这个文件是给 AI 助手看的，告诉它本项目的所有约定。
> 任何 AI 在本项目中工作前都必须先读这个文件。

---

## 1. 项目概述

**长寿养生**是一个面向中老年人的健康知识科普应用。核心功能：知识卡片科普 + 现代营养学 + 辟谣打假，帮助中老年用户建立正确的养生观念。

目标用户画像：
- 年龄：55-75岁
- 特点：迷信补品，信息来源为老姐妹推荐和短视频
- 核心需求：大白话科普 + 数据支撑

---

## 2. 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js 14 (App Router) | 最新稳定版 |
| 语言 | TypeScript | strict 模式 |
| 样式 | Tailwind CSS | 移动端优先 |
| 组件 | shadcn/ui | 按需复制到 `src/components/ui/` |
| i18n | next-intl | 默认中文 zh，可切日文 ja |
| 内容 | TypeScript 文件 | 知识卡片存储在 `src/content/cards/` |

---

## 3. 目录结构

```
WellnessLife/
├── CLAUDE.md              # 本文档
├── PRD.md                 # 产品需求文档
├── README.md              # 项目说明
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── src/
    ├── app/
    │   └── [locale]/
    │       ├── layout.tsx     # 国际化布局
    │       ├── page.tsx       # 首页
    │       └── health/        # 养生知识页
    │           ├── page.tsx   # 页面组件
    │           └── health-cards.css
    ├── components/
    │   └── icons/             # SVG 图标
    │       ├── egg.svg
    │       ├── rice-bowl.svg
    │       └── ...
    ├── content/
    │   └── cards/
    │       ├── category.ts     # 分类定义
    │       ├── index.ts       # 汇总导出
    │       ├── diet/          # 饮食板块
    │       ├── exercise/      # 运动板块
    │       ├── sleep/         # 睡眠板块
    │       ├── mindset/       # 心态板块
    │       └── debunk/        # 辟谣板块
    └── styles/
        └── health-cards.css
```

---

## 4. 卡片内容规范

### 卡片结构（五要素）

```typescript
interface Card {
  id: string;              // 唯一标识，如 'diet-001'
  categoryId: CategoryId;  // 所属分类
  title: string;           // 标题（情感化）
  content: string;         // 正文（大白话，分段）
  actionTip: string;       // 行动建议
  dataPoint?: {
    value: string;         // 数据值，如 '22倍'
    description: string;   // 数据说明
  };
  relatedIcon: string;     // 关联图标名
  tags: string[];          // 标签
  series?: string;         // 系列名
  readTime: number;        // 阅读时间（秒）
}
```

### 内容创作原则

1. **标题情感化** — 像在和用户说话，如"肉蛋豆鱼，吃对了就是最好的蛋白"
2. **正文大白话** — 专业术语要有简单解释
3. **数据要具体** — 辟谣必须有数字支撑
4. **行动要明确** — "今天可以这样做"

### 辟谣内容规范

1. 先承认感受："理解为什么觉得XX好——老一辈传下来的..."
2. 成分分析："但科学检测发现..."
3. 数据对比："猪肝 vs 阿胶：铁含量差22倍"
4. 替代方案："与其花几百块买XX，不如..."

---

## 5. 图标规范

### SVG 风格
- 简洁卡通风格
- 圆形浅黄背景（#FEF3C7）
- 大色块，易辨认
- 中老年友好

### 图标命名
- 文件名：`kebab-case`，如 `rice-bowl.svg`
- 组件名：`PascalCase`，如 `RiceBowl`

### 图标存放
- 路径：`src/components/icons/`
- 预览页：`public/preview.html`

---

## 6. 分类定义

| ID | 名称 | 图标 | 颜色 |
|----|------|------|------|
| diet | 饮食 | 🍽️ | #F59E0B |
| exercise | 运动 | 🧘 | #3B82F6 |
| sleep | 睡眠 | 😴 | #8B5CF6 |
| mindset | 心态 | 🌸 | #EC4899 |
| debunk | 辟谣 | 🚫 | #EF4444 |

---

## 7. 常用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build           # 构建生产版本
pnpm typecheck       # TypeScript 类型检查
pnpm lint            # ESLint 检查
```

---

## 8. 注意事项

- 所有用户可见文本必须通过 i18n
- 卡片内容存储在 TypeScript 文件，便于 AI 更新
- SVG 图标用代码编写，便于定制
- 移动端优先，字号要大（正文 18px+）
- 辟谣内容必须有数据支撑，不能空口说

---

## 9. 内容更新流程

当需要更新或添加卡片时：

1. 确定卡片所属分类和系列
2. 按五要素结构编写内容
3. 确认相关图标（可在预览页查看）
4. 添加到对应文件
5. 运行 `pnpm typecheck` 验证
6. 测试页面显示

---

## 10. 常见问题

**Q: 图标找不到？**
A: 检查 `relatedIcon` 字段值是否与图标文件名匹配

**Q: 卡片不显示？**
A: 检查卡片是否已添加到 `index.ts` 的汇总中

**Q: 样式不对？**
A: 检查 `health-cards.css` 是否正确引入
