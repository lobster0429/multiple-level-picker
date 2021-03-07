class MultipleLevelPicker {
  constructor(config) {
    this.config = config;
    this.limit = this.config.limit;
    this.init();
    this.selected = {
      count: 0,
      ids: [],
      names: [],
    };
    this.level = 0;
  }

  init () {
    this.render(); 
    this.bind();
  }

  render () {
    this.$root = $('<div class="multiple-level-picker">')
    const $title = $(`<strong class="mlp-title">${this.config.title}</strong>`)
    const $selector = $('<div class="mlp-selector"></div>');
    this.$selectedNotice = $(`<div>已選擇：<span class="mlp-current-selected">0</span>/${this.limit}</div>`);

    $title.appendTo(this.$root);
    this.$selectedNotice.appendTo(this.$root);
    $selector.appendTo(this.$root);
    
    this.$submit = $('<button class="mlp-submit">確認送出</button>')
    this.$submit.appendTo(this.$root);

    this.$root.appendTo('body');

    this.createTree(this.config.source, $selector); 
  }
  
  bind () {
    this.$root.on('change', 'input[type="checkbox"]', evt => {
      const $this = $(evt.currentTarget),
            checked = $this.prop('checked'),
            id = $this.val(), 
            name = $this.data('name'),
            pid = $this.data('parent'),
            $children = $(`[data-belong="${id}"]`);
      if (checked && this.selected.count < this.limit) {
        this.selected.count++;
        this.selected.ids.push(id);
        this.selected.names.push(name);
        if ($children.length !== 0) {
          $children.find('input[type="checkbox"]').prop('disabled', true);
        }
      }else{
        console.log('aaa');
        const idIndex = this.selected.ids.indexOf(id),
              nameIndex = this.selected.names.indexOf(name);
        if (idIndex !== -1 && nameIndex !== -1){
          this.selected.count--;
          this.selected.ids.splice(idIndex, 1);
          this.selected.names.splice(nameIndex, 1);
        }
        if ($children.length !== 0) {
          $children.find('input[type="checkbox"]').prop('disabled', false);
        }
      }  
      this.$selectedNotice.find('span').text(this.selected.count);
    })
    this.$root.on('click', 'button.mlp-submit', evt => {
      console.log('submit');
      this.trigger('submit', this.selected);
    })
  }

  createTree(loop, $p, pdata) {
    this.level++;
    if (loop !== null) {
      let $wrap = $(`<ul class="mlp-wrap" data-level="${this.level}">`);
      if (pdata) {
        $wrap.attr('data-belong', pdata.id);
      }
      loop.forEach(itm => {
        const $itm = $(`<li class="mlp-itm"><label><input type="checkbox" value="${itm.id}" data-name="${itm.name}">${itm.name}</label>`) 
        $itm.appendTo($wrap);
        $wrap.appendTo($p);
        if (pdata) {
          $itm.find('input').attr('data-parent', pdata.id);
        }
        if (itm.children !== null) {
          const $down = $(`<button class="mlp-down">down</button></li>`);
          $down.appendTo($itm);
          this.createTree(itm.children, $itm, itm);
        }else{
           
        }
      })
    }
  }

  on (a, cb) {
    this.callbacks = {
      submit: [],
    }

    if (this.callbacks.hasOwnProperty(a) && typeof cb == 'function') {
      this.callbacks[a].push(cb);
    }
  }

  trigger(a, args) {
    if (this.callbacks.hasOwnProperty(a)) {
      this.callbacks[a].forEach(fn => {
        fn(args);
      })
    } 
  }
}
