---
name: bali-dive-trip-2026
description: >
  峇里島潛旅行程管理工具。用於修改、更新2026年2月22-28日的峇里島藍夢島潛水旅行行程。
  當使用者提到「峇里島行程」、「潛旅修改」、「更新旅行計畫」、「行程app」、「記帳」、「加照片」時觸發此技能。
  涵蓋：每日行程卡片、航班資訊（華航CI771/長榮BR255）、住宿（Abian Harmony/Scooby Doo/Villa）、
  藍夢島潛水排程、景點攻略、美食推薦、團員記帳系統、精選照片、緊急聯絡。
  使用此技能來修改現有的HTML行程檔案。
---

# 峇里島潛旅 2026 — 行程管理 Skill

## 團員名單（9人）

| 暱稱 | 備註 |
|------|------|
| 小咖 | 潛水教練 |
| Yoyo | |
| 薏萱 | 柯南 |
| 韵馨 | 骨折 |
| Millie | |
| 天澤 | |
| 曹曹 | |
| 小夫 | |
| Ting | |

## 行程概要

| 日期 | 地點 | 主要活動 | 住宿 |
|------|------|---------|------|
| 2/22 (日) | 峇里島 | 抵達，Santorini Greek Restaurant 晚餐，Agatha SPA | Abian Harmony |
| 2/23 (一) | 藍夢島 | 07:00早餐→07:50出發→10:00抵達，潛水×2 | Scooby Doo（WiFi: Scoobyroom / goodnight）|
| 2/24 (二) | 藍夢島 | 潛水×3 | Scooby Doo |
| 2/25 (三) | 藍夢島 | 潛水×3 | Scooby Doo |
| 2/26 (四) | 藍夢島 | 睡飽＋陸遊（Devil's Tears, Dream Beach, Yellow Bridge, Mangrove, Panorama Point）| Scooby Doo |
| 2/27 (五) | 峇里島 | 返回＋陸遊（Ubud/Seminyak）| Villa |
| 2/28 (六) | 峇里島 | 逛街購物（Krisna）＋回程 | — |

## 航班資訊

### A組 華航
- 去程：CI771 TPE T1 09:10 → DPS 14:40
- 回程：CI772 DPS 15:45 → TPE T1 21:05
- 票價：TWD 14,444

### B組 長榮
- 去程：BR255 TPE T2 10:00 → DPS T1 15:30（經濟艙 Basic W）
- 回程：BR256 DPS T1 16:40 → TPE T2 21:45（商務艙 Standard J）
- 票價：TWD 27,679

## 已記帳消費

| 日期 | 誰 | 項目 | 金額 | 幣別 | 分類 |
|------|----|------|------|------|------|
| 2/22 | 小咖 | Agatha SPA 全身按摩 | 180 | TWD | spa |
| 2/22 | 小夫 | Agatha SPA 全身按摩 | 180 | TWD | spa |
| 2/22 | Millie | Agatha SPA 全身按摩 | 180 | TWD | spa |
| 2/22 | 天澤 | Agatha SPA 全身按摩 | 180 | TWD | spa |
| 2/22 | 曹曹 | Agatha SPA 全身按摩 | 180 | TWD | spa |

### SPA 參考價格
- 全身按摩 NT$180
- 腳部 NT$150
- 背後 NT$180

## 已嵌入照片

| 位置 | 描述 | 來源 |
|------|------|------|
| D1 Santorini 晚餐卡片 | 藍白遮棚下合照（IMG_9293） | 精選 |
| D2 早餐卡片 | 火腿起司可頌 + Mie Goreng（IMG_9225, IMG_9226）| 精選 |
| D2 晚餐卡片 | 餐廳合照 film風（IMG_9292）| 精選，含「顯示更多照片」按鈕 |

### 照片處理流程
1. 使用者傳照片 → `convert` 縮小至 600px 寬，quality 60
2. `base64` 編碼嵌入 HTML
3. 精選照片直接顯示，額外照片放在「顯示更多照片」toggle 內
4. 所有照片可點擊 → lightbox 全螢幕 → 下載按鈕

## 修改指南

修改行程時：
1. 讀取此 SKILL.md 了解行程結構
2. 開啟並修改 `bali-trip.html` 檔案
3. HTML 結構說明：
   - `#page-itinerary` — 每日行程頁（含 `#day-0` 至 `#day-6` 七天內容）
   - `#page-flights` — 航班/住宿/緊急聯絡/實用資訊
   - `#page-budget` — 靜態記帳系統（由 Claude 維護，無使用者互動）
4. 卡片分類 tag class：
   - `.tag-dive` 潛水 | `.tag-food` 美食 | `.tag-transport` 交通
   - `.tag-spot` 景點 | `.tag-hotel` 住宿 | `.tag-warning` 警告
5. 亮顯標籤 class：
   - `.hl-food` 必吃 | `.hl-menu` 必點 | `.hl-buy` 必買 | `.hl-tip` 攻略 | `.hl-warn` 注意

### 記帳系統
- 記帳為**靜態模式**：所有帳目直接寫在 JS `expenses` 陣列中
- 新增消費時：在 `expenses` 陣列加入 `{ person, desc, amount, currency, cat, date }` 物件
- 匯率常數 `RATE = 500`（1 TWD = 500 IDR）
- 支援 TWD / IDR / USD 三種幣別
- 團員展開/收合顯示各自明細

### 新增照片
- 圖片用 imagemagick `convert` 壓縮至 600px 寬 quality 60
- base64 嵌入 `.card-photos` 容器
- 加上 `onclick="downloadPhoto(this)"` 啟動 lightbox
- 額外照片放在 `.toggle-content` 內，由 `.more-photos-btn` 控制顯示

## 設計規範
- 風格：日式極簡
- 字體：Shippori Mincho（標題）+ Noto Sans TC（內文）
- 配色：`--accent: #3D7B8A`（主色調），各分類有獨立色系
- 手機優先：所有元素針對 375px-428px 寬度優化
- 導航按鈕一律連結 Google Maps
- lightbox：全螢幕照片檢視 + 下載功能

## 部署建議
- 檔案含 base64 圖片，約 300KB，artifact publish 可能失敗
- 建議下載 HTML 檔直接使用或部署至 Tiiny.host / Netlify Drop
- 離線可用（所有資源內嵌）
