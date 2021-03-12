class MultipleLevelPickerV2 {
  constructor() {
    this.data = datav2;
    this.render();  
    this.bind();
    this.proto = [1, 2, 2, 2, 2];
  }
  render() {
    this.$root = $('<div id="mlp">'); 
    const $ul = $('<ul>');
    this.data[0].forEach((u, i) => {
      const $u = $(`<li><div class="mlp-itm" data-pos="1" id="${u.id}">${u.name}</div></li>`);
      $u.appendTo($ul);
    });
    $ul.appendTo(this.$root);
    this.$root.appendTo($('body'));
  }
  bind() {
    this.$root.on('click', '.mlp-itm', evt => {
      evt.stopPropagation();
      const $this = $(evt.currentTarget);
      const $li = $this.parent('li');
      const pos = parseInt($this.data('pos'));
      const children = this.next(pos, $this.attr('id'));
      console.log(children);
      this.createChildren($li, pos + 1, children);
    }) 
  }

  createChildren ($t, pos, arr) {
    const $w = $(`<ul>`);
    arr.forEach(u => {
      const $u = $(`<li><div class="mlp-itm" data-pos="${pos}" id="${u.id}">${u.name}</div></li>`);
      $u.appendTo($w);
    });
    $w.appendTo($t);
  }

  next (pos, id) {
    const start = (() => {
      let s = 1;
      for (let i = 0; i < (pos - 1); i++) {
        s += this.proto[i];
      }
      return s;
    })(); 
    console.log(start);
    //console.log(start+this.proto[pos]);

    const pid = parseInt(id.toString().slice(start, start + this.proto[pos-1]));
    console.log(pid);
    return this.data[pos][pid - 1];
  }
}
$(document).on('ready', () => {
  const pickerv2 = new MultipleLevelPickerV2();
})


