# Claude Starter Kit

> 一行指令，開始自我進化開發

## 🚀 快速開始

**在任何專案目錄執行：**

```bash
curl -fsSL https://raw.githubusercontent.com/miles990/claude-starter-kit/main/setup.sh | bash
```

**或者使用 npx：**

```bash
npx skillpkg-cli init --preset=standard --install
```

完成後，打開 Claude Code 輸入：

```
/evolve 你想做的事情
```

---

## 📖 這是什麼？

Claude Starter Kit 自動幫你設置：

| 功能 | 說明 |
|------|------|
| **記憶系統** | Claude 會記住學到的東西 |
| **自我進化** | 自動分析→學習→執行→改進 |
| **技能管理** | 按需安裝專業技能 |
| **陷阱警告** | Sharp Edges - 主動警告常見錯誤 |
| **代碼驗證** | Validations - 自動檢查程式碼問題 |
| **技能協作** | Collaboration - 智能委派和上下文傳遞 |

---

## 🎯 使用範例

```bash
# 建立 API
/evolve 建立一個 Express + TypeScript 的 RESTful API

# 優化效能
/evolve 分析這個專案的效能瓶頸並優化

# 學習新技術
/evolve 用 ComfyUI 建立圖片生成工作流程
```

Claude 會自動：
1. 分析目標並拆解任務
2. 搜尋過去經驗（如果有）
3. 學習需要的技能
4. 迭代執行直到完成
5. 記錄學到的經驗

---

## 📁 產生的檔案

```
your-project/
├── CLAUDE.md              # 專案說明（Claude 會讀）
└── .claude/
    ├── memory/            # 經驗記憶
    └── skills/            # 已安裝技能
```

---

## 🛠 其他命令

```bash
# 搜尋技能
skillpkg search "你要的功能"

# 安裝技能
skillpkg install user/repo

# 查看已安裝
skillpkg list
```

---

## 📚 進階

- [文檔導覽](docs/README.md) - 所有文檔的索引
- [完整教學指南](docs/INTELLIGENT_ECOSYSTEM_GUIDE.md)
- [Self-Evolving Agent](https://github.com/miles990/self-evolving-agent)
- [skillpkg](https://github.com/miles990/skillpkg)

---

## License

MIT
