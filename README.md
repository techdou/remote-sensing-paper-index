# 遥感图像分类论文索引

基于项目 Excel 整理的 2023–2026 遥感图像分类论文静态索引站点。

## 功能

- 按 CCF-A、一区及高影响期刊、相关补充、筛选浏览
- 按会议/期刊、年份与 PDF 可用性筛选
- 搜索标题、摘要、机制、模态和数据集
- 独立论文详情视图
- 正式来源链接与公开 PDF 下载

## 本地预览

```bash
python3 -m http.server 8000
```

访问 `http://localhost:8000`。

## 更新数据

替换根目录 Excel 后执行：

```bash
python3 generate_site_data.py
```

站点为纯静态 HTML/CSS/JavaScript，可直接部署到 GitHub Pages。
