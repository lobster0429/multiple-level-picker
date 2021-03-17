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
| source | String |  | 指定選單的資料來源 api，必填 |
| selectLowest | Boolean | false | 設定是否僅能選擇最底層的選項 |
| title | String |  | 設定選單標題文字 |
| limitText | String |  | 設定已選擇顯示文字 |
| rootTab | String | / | 設定最上層頁籤顯示文字 |
|  chosen | Object | {} | 設定預設已選項目，範例格式 {'010300000000': '動物飼料','010101000000': '農用溫室','020102000000': '親子裝'} |


