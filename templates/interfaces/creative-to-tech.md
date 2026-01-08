# Creative → Tech Interface

> 創意領域需求到技術實現的映射

## Domain Skills

| Skill | 描述 | 深度需求 |
|-------|------|---------|
| game-design | 遊戲設計與開發 | 機制、關卡、平衡 |
| content-creation | 內容創作策略 | 寫作、影片、社群 |
| digital-art | 數位藝術創作 | 插畫、3D、動畫 |
| video-production | 影片製作 | 拍攝、剪輯、特效 |
| music-production | 音樂製作 | 作曲、混音、母帶 |

## 需求 → 技術映射

| 領域需求 | 技術實現 | Software Skills | 優先級 |
|---------|---------|-----------------|--------|
| 遊戲引擎 | Unity/Godot | `game-development`, `performance` | 必要 |
| 3D 渲染 | Three.js/WebGL | `frontend`, `performance` | 高 |
| 資產管理 | CDN + Storage | `cloud-architecture`, `api-design` | 高 |
| 互動網頁 | Canvas/WebGL | `frontend`, `animation` | 中 |
| AI 生成 | Stable Diffusion | `python`, `ml-integration` | 中 |
| 串流媒體 | HLS/DASH | `backend`, `realtime-systems` | 中 |
| 社群功能 | Comments/Likes | `backend`, `database` | 中 |

## 推薦組合模式

### 模式 1: 網頁遊戲
**場景**: 瀏覽器遊戲、H5 小遊戲

```yaml
domain:
  - game-design (深度)
software:
  - game-development
  - frontend
  - backend
  - database
```

### 模式 2: 創作者平台
**場景**: 內容發布、社群互動

```yaml
domain:
  - content-creation (深度)
  - digital-art (基礎)
software:
  - frontend
  - backend
  - database
  - cms-development
  - cloud-architecture
```

### 模式 3: AI 藝術工具
**場景**: AI 生成圖片/影片

```yaml
domain:
  - digital-art (深度)
software:
  - python
  - ml-integration
  - frontend
  - api-design
  - cloud-architecture
```

### 模式 4: 互動展示
**場景**: 數位展覽、品牌體驗

```yaml
domain:
  - digital-art (深度)
  - content-creation (基礎)
software:
  - frontend
  - animation
  - performance-optimization
  - accessibility
```

### 模式 5: 遊戲 + 社群
**場景**: 多人遊戲、排行榜、成就系統

```yaml
domain:
  - game-design (深度)
software:
  - game-development
  - frontend
  - backend
  - database
  - realtime-systems
  - api-design
```

## 依賴聲明範例

```yaml
# game-design/SKILL.md
dependencies:
  software-skills:
    - game-development
    - frontend
    - performance-optimization

# digital-art/SKILL.md
dependencies:
  software-skills:
    - frontend
    - python
    - cloud-architecture

# content-creation/SKILL.md
dependencies:
  software-skills:
    - frontend
    - cms-development
    - seo-technical
```

## 常見技術選型

| 需求類型 | 推薦技術 | 替代方案 |
|---------|---------|---------|
| 遊戲引擎 | Godot, Phaser | Unity WebGL |
| 3D 渲染 | Three.js | Babylon.js |
| 動畫 | Framer Motion | GSAP, Lottie |
| AI 生成 | Stable Diffusion | Midjourney API |
| 影片處理 | FFmpeg | HandBrake |
| 儲存 | S3/R2 | GCS, Azure Blob |
| CDN | Cloudflare | Fastly, AWS CloudFront |
