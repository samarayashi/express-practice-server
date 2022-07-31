# express-practice-server
practice building server with nodejs-express.

已實現：
1. 後端架構
  1-1 api層、service層實作、utils、boot的概念與實作
2. express框架使用
  2-1 router概念
  2-2 middleware概念
  2-3 session, cookie, body
3. api測試文件openapi/swagger
4. passport實作local登入驗證
5. redis儲存session

未實作
1. sequlize連接DB並且和自動產生model，目前先以fakeDBData假設DB存在
2. docker封裝DB環境，打整個開發環境打包設定好，達到開箱即用

前端頁面
/explorer
1. 目前先以swagger代替前端打Api的操作行為
