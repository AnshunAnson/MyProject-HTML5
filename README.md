# Unreal Engine HTML5 前端模板

这是一个基于 Unreal Engine 的 HTML5 游戏前端模板，包含了完整的加载界面、样式和控制功能。

## 目录结构

```
template/
├── css/                 # 样式文件
│   ├── game.css        # 游戏样式
│   └── bootstrap.min.css
├── js/                  # JavaScript 文件
│   ├── game.js         # 游戏控制脚本
│   ├── jquery-2.1.3.min.js
│   └── bootstrap.min.js
├── fonts/              # 字体文件
├── index.html          # 主HTML文件
└── README.md           # 本文档
```

## 快速开始

### 1. 放入你的UE游戏文件

将Unreal Engine导出的HTML5游戏文件放到对应位置：

```
template/
├── js/
│   ├── [你的游戏名].UE4.js      # 放入这里
│   ├── UE4Game.js               # 放入这里
│   ├── UE4Game.wasm             # 放入这里
│   └── ...
└── [你的游戏数据文件].data       # 放在根目录或js目录
```

### 2. 修改index.html

在 `index.html` 底部添加你的UE脚本引用：

```html
<script src="js/game.js"></script>
<script src="js/你的游戏名.UE4.js"></script>  <!-- 添加这一行 -->
```

### 3. 自定义配置

#### 主题颜色

在 `css/game.css` 中修改：

```css
/* 主色调 */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);

/* 强调色 */
border-top-color: #e94560;
background: linear-gradient(90deg, #e94560, #0f3460);
```

#### 游戏标题

在 `index.html` 中修改：

```html
<title>你的游戏标题</title>
<div class="game-title">你的游戏标题</div>
```

## 功能特性

### ✨ 加载界面

- 平滑的加载动画
- 真实的进度条
- 优雅的渐变背景

### 🎮 游戏控制

- 暂停/继续按钮
- 全屏切换
- 优化的画布显示

### 📱 响应式设计

- 支持各种屏幕尺寸
- 移动端适配
- 全屏游戏体验

## 技术栈

- HTML5
- CSS3
- JavaScript
- jQuery 2.1.3
- Bootstrap 3.3.4

## 文件说明

### index.html

主HTML文件，包含：
- 加载屏幕
- 游戏画布
- 控制按钮
- 加载监听脚本

### css/game.css

样式文件，包含：
- 基础样式重置
- 加载界面样式
- 游戏画布样式
- 按钮样式

### js/game.js

JavaScript文件，包含：
- 加载进度监听
- 游戏控制逻辑
- 全屏功能

## 许可证

基于 Unreal Engine 官方模板，可自由使用和修改。
