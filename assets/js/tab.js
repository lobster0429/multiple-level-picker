function tab(tab, tab_list) {
  for (let i = 0; i < $(`.${tab}`).length; i++) {
    $(`.${tab_list}`).css("display", "none");
    $(`.${tab_list}`).eq(0).css("display", "block");
    $(`.${tab}`)
      .eq(i)
      .on("click", function (e) {
        $(`.${tab}`).removeClass("active");
        $(`.${tab}`).eq(i).addClass("active");
        $(`.${tab_list}`).css("display", "none");
        $(`.${tab_list}`).eq(i).css("display", "block");
        e.stopPropagation();
      });
  }
}

tab("notice_tab", "notice_tab_area");
