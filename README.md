# BARREL BOUND｜鋼塔救援

9:16 原創攀梯跳桶街機遊戲。以經典攀梯救援玩法為靈感，所有角色、畫面、名稱、音樂與音效由本專案原創繪製及合成；未使用 Nintendo 的角色、美術、商標或遊戲音樂。

## 遊玩

- 電腦：← → / A D 移動，↑ ↓ / W S 攀梯，Space 跳躍。
- 手機：方向鍵搭配 JUMP；支援多指同時移動與跳躍。
- P / Esc 暫停，M 切換聲音，Enter 開始／繼續。
- 六層鋼架、三關漸進難度。到達頂層右側即可救援過關。
- 跳過滾桶 +100；能量晶體 +300；動力鎚持續 8 秒，擊碎滾桶 +200；每關剩餘時間 ×10 加分。
- 三條生命，過關恢復一條（上限三條）。每關限時 180 秒；受傷回到當層入口並有 2.6 秒保護。
- 最高分、聲音偏好保存在目前瀏覽器 localStorage。清除網站資料會清除紀錄，沒有跨裝置同步。
- 音樂由開始按鈕的使用者手勢啟動；切換分頁自動暫停。

## 架構與修改

無套件、無建置步驟、無伺服器／帳號／資料庫。Sites 靜態根目錄為 `dist`。

- `dist/index.html`：繁體中文介面、HUD、狀態面板、控制鍵。
- `dist/style.css`：9:16 等比顯示、響應式容器單位、觸控與視覺。
- `dist/game.js`：固定 120 Hz 物理、Canvas 2D 程序美術、Web Audio 原創雙聲部配樂與音效、遊戲狀態。
- `tests/game.test.cjs`：Node VM 自動驗證移動、跳躍、攀梯、三關完整路線、勝利、受傷、暫停與重開。路線測試隔離滾桶以單獨驗證可達性。
- `.openai/hosting.json`：既有 Site ID 與靜態部署設定。

Canvas 邏輯座標 540×960，實際繪圖 1080×1920。修改 `ground()` 可調整鋼架高度，`ladderList()` 可調整各關梯子，`themes` 修改各關色彩。`spawnTimer` / `spawnBarrel()` 調整滾桶速度及頻率。配樂為 `audio.tick()` 內原創音符序列。

## 驗證與部署

```sh
node --check dist/game.js
node tests/game.test.cjs
```

將 `dist/` 交給靜態 HTTP 服務即可執行。Sites 部署須保留既有 project_id；使用 Sites source workflow 推送、包裝後將精確 commit 與封裝送交部署，保留目前私密權限。

## GitHub Pages 公開發布

公開遊玩網址：https://bd-cs1.github.io/barrel-bound/

- 儲存庫已公開，Pages 來源為 GitHub Actions。
- `.github/workflows/pages.yml` 在 `main` 每次推送時自動執行；也可於 Actions → Publish GitHub Pages → Run workflow 手動啟動。
- 流程先執行語法檢查與遊戲測試，再將 `dist/` 上傳並部署至 GitHub Pages；不需要 API 金鑰或額外套件。
- 只公開 `dist/` 內的遊戲檔案；測試與部署說明保留在原始碼儲存庫。
- 回復版本：將要回復的遊戲檔案以新提交還原至 `main`，讓同一流程重新部署。不要刪除 Git 歷史。
- GitHub Pages 與 Sites 是獨立部署；GitHub 推送不會自動更新 Sites。

## 已知限制

- 這是現代瀏覽器遊戲，沒有原生 App 安裝包、PWA 離線快取、遊戲手把或雲端排行榜。
- 三關共用六層結構，各關改變梯位、配色與速度，非原作關卡複刻。
- 手機較長或較寬的螢幕會保留背景留白，以維持完整 9:16 構圖。
- 全螢幕依瀏覽器支援；iOS 可用「加入主畫面」改善顯示，但本版未提供離線能力。
- 多指觸控已實作，真實 iOS / Android 裝置的手感與音訊仍建議實機驗證。

## 後續可擴充

關卡編輯器、不同鋼架布局、額外敵人、可選角色、手把、音樂／音效獨立音量、PWA、可驗證的排行榜。
