let custom_status = $(".custom_status");
console.log(custom_status.length);

for (let i = 0; custom_status.length > i; i++) {
  switch (custom_status.eq(i).text()) {
    case "未兌換":
      custom_status.eq(i).css("color", "block");
      break;
    case "已兌換":
      custom_status.eq(i).css("color", "#1d2bcc");
      break;
    case "不適合":
      custom_status.eq(i).css("color", "red");
      break;
  }
}
