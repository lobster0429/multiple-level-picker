function dropdown(dropdownBox, list) {
  for (let i = 0; i < $(`.${dropdownBox}`).length; i++) {
    $(`.${dropdownBox}`)
      .eq(i)
      .on("click", function (e) {
        $(`.${list}`).css("display", "none");
        $(`.${list}`).eq(i).css("display", "block");
        e.stopPropagation();
      });
    $(`.${list}`).on("click", function (e) {
      e.stopPropagation();
    });
  }
}
dropdown("moreOperating", "operating_list");
dropdown("addProduct", "addProduct_list");
dropdown("notice", "notice_list");
dropdown("notice_setting", "notice_setting_list");
document.onclick = function (e) {
  $(".notice_list").css("display", "none");
  $(".operating_list").css("display", "none");
  $(".addProduct_list").css("display", "none");
  $(".notice_setting_list").css("display", "none");
};
$(".notice_list").on("click", function () {
  $(".notice_setting_list").css("display", "none");
});
