# 版本
當前版本為 v2，後續描述皆以此版本為主

# 安裝方式
分為兩個主要檔案，一支 css 以及一支 js
```html
  <link href="${your_path}/multiple-level-picker.v2.css" rel="stylesheet" />
  <script src="${your_path}/multipleLevelPicker.v2.js"></script>
```

# 使用方式
```javascript
const config = {
  source: 'http://test.iwowpao.com/api/industryclass.php',
  prefix: 'industry',
  limit: 3,
  title: '產品類型選單',
  rootTab: '全部產品',
  limitText: '已選擇：',
}
const picker = new MultipleLevelPicker(config);
```
此範例資料來源為 industry api ，source 為必要設定
以下為所有設定

# 設定
| 名稱 | 資料類型 | 預設值 | 功能說明 |
| --- | --- | --- | --- |
| prefix | String |  | 用於指定此選單內指定 id 屬性的前綴 |
| limit  | Number | 1 | 限制選單可選取數量 |
| source | String | null | 指定選單的資料來源 api，必填 |
| selectLowest | Boolean | false | 設定是否僅能選擇最底層的選項 |
| lang | String | 1 | 指定 api 拉取資料語言 |
| text | Object |  | 設定顯示文字，細節設定見 text 表格 |
| chosen | Object | {} | 設定預設已選項目，格式範例見下|

### text 設定範例與內容
```javascript
const text = {
  title: '產品選單',
  submitBtn: '確認送出',
  canelBtn: '取消',
}
```
| 名稱 | 資料類型 | 預設值 | 欄位說明 |
| --- | --- | --- | --- |
| title | String | Menu | 選單標題 |
| limit | String | Selected | 已選提示顯示 |
| rootTab | String | All | 跟目錄頁籤文字 |
| submitBtn | String | Submit | 送出按鈕文字 |
| cancelBtn | String | Cancel | 取消按鈕文字 |


### chosen 格式範例 
```javascript
const obj ={
  '010300000000': '動物飼料',
  '010101000000': '農用溫室',
  '020102000000': '親子裝'
};
```

# Callbacks 
此套件目前提供以下回傳，使用範例與回傳時機說明如下：

```javascript
picker.on('submit', (res) => {console.log(res)});
```

| 名稱 | 作用時機 | 回傳資料 |
| --- | --- | --- |
| update | 當資料異動時 | 當前選擇的資料 |
| submit | 當按下送出按鍵時 | 當前選擇的資料 |
| cancel | 當按下取消按鍵時 | 本來已選擇的資料 |

#Methods
使用範例
```javascript
picker.remove(`${id}`);
```

| 名稱 | 作用 | 參數 |
| --- | --- | --- |
| show() | 顯示選單 | |
| hide() | 隱藏選單 | |
| add(i, v) | 增加資料 | i: 增加資料的id<br/>v: 增加資料的文字名稱 |
| remove(i) | 刪除資料 | i: 增加資料的id |



