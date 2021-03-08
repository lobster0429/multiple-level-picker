let moveOperating = $(".moveOperating");
let operating_list = $(".operating_list");
for (let i = 0; i < moveOperating.length; i++) {
  moveOperating.eq(i).on("click", function (e) {
    operating_list.css("display", "none");
    operating_list.eq(i).css("display", "block");
    e.stopPropagation();
  });
}
document.onclick = function (e) {
  operating_list.css("display", "none");
};
