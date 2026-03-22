# Power BI Theme Studio

一个从 0 开始搭建的轻量级网页工具，用于直观设计、预览并导出 Power BI 主题 JSON。

## 功能

- 通过图形界面配置主题名称、字体、主色、辅助色、背景色与数据色。
- 实时预览类似 Power BI 仪表板的卡片、折线图、柱状图和表格样式。
- 自动生成可复制、可下载的 Theme JSON。
- 零依赖静态实现，直接打开 `index.html` 即可使用。

## 使用方式

### 直接打开

直接用浏览器打开 `index.html`。

### 本地启动静态服务

```bash
python3 -m http.server 4173
```

然后访问：<http://localhost:4173>

## 文件结构

- `index.html`：页面结构
- `styles.css`：界面样式与预览布局
- `main.js`：主题状态、实时预览与 JSON 导出逻辑
