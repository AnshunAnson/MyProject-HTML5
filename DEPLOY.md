# 发布到 GitHub Pages

## 前置要求

1. 拥有一个 GitHub 账号
2. 安装了 Git

## 发布步骤

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建一个新仓库（仓库名建议：yardstick-game 或其他你喜欢的名字）
3. 选择 Public 或 Private（Public 才能免费使用 GitHub Pages）
4. 不需要初始化 README、.gitignore 或 LICENSE

### 2. 初始化 Git 仓库

在当前目录打开终端，执行：

```bash
git init
git add .
git commit -m "Initial commit: Yardstick HTML5 game"
```

### 3. 连接到 GitHub

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 4. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Build and deployment** 下：
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `main` 分支，文件夹选择 `/ (root)`
5. 点击 **Save**

### 5. 访问你的游戏

等待几分钟后，你的游戏将可以通过以下地址访问：
```
https://你的用户名.github.io/你的仓库名/
```

## 文件说明

当前项目结构：

```
HTML5/
├── css/              # 样式文件
│   ├── game.css
│   └── bootstrap.min.css
├── js/               # JavaScript 文件
│   ├── game.js
│   ├── jquery-2.1.3.min.js
│   └── bootstrap.min.js
├── fonts/            # 字体文件
├── Yardstick.UE4.js  # UE4 游戏主脚本
├── Yardstick.*       # 其他 UE4 游戏文件
├── index.html        # 主页面
└── README.md         # 说明文档
```

## 注意事项

1. GitHub Pages 对单个仓库有 1GB 的大小限制
2. 首次部署可能需要 5-10 分钟才能生效
3. 如果使用 Private 仓库，需要 GitHub Pro 才能使用 Pages
4. 确保所有文件路径正确，特别是 Yardstick.UE4.js 的引用
