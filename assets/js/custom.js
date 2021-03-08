flatpickr(".flatpickr");

var examples = document.querySelector(".flatpickr");

var configs = {
  datetime: {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
  },
};

var slider = new MasterSlider();

slider.control("arrows", {
  autohide: true,
  overVideo: true,
});
slider.control("circletimer", {
  autohide: false,
  overVideo: true,
  color: "#FFFFFF",
  radius: 4,
  stroke: 9,
});
slider.control("slideinfo", {
  autohide: false,
  overVideo: true,
  dir: "h",
  align: "bottom",
  inset: false,
  margin: 10,
});
slider.setup("masterslider", {
  width: 700,
  height: 350,
  minHeight: 0,
  space: 10,
  start: 1,
  grabCursor: true,
  swipe: true,
  mouse: true,
  keyboard: false,
  layout: "partialview",
  wheel: false,
  autoplay: false,
  instantStartLayers: false,
  loop: true,
  shuffle: false,
  preload: 3,
  heightLimit: true,
  autoHeight: false,
  smoothHeight: true,
  endPause: false,
  overPause: true,
  fillMode: "fill",
  centerControls: true,
  startOnAppear: false,
  layersMode: "center",
  autofillTarget: "",
  hideLayers: false,
  fullscreenMargin: 0,
  speed: 20,
  dir: "h",
  parallaxMode: "swipe",
  view: "partialWave",
});
