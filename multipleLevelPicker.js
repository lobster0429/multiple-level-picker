class MultipleLevelPicker {
  constructor(config) {
    const defaultConfig  = {
      title: '',
      source: [],
      limit: false,
      acceptLevel: false, 
    }
    this.config = $.extend({}, defaultConfig, config);
    this.limit = this.config.limit;
    this.path = [];
    this.selected = [];
    this.depth = 0;
    this.init();
  }

  init () {
    this.render(); 
    this.bind();
  }

  render () {
    this.$root = $('<div class="multiple-level-picker" style="display: none;">')
    this.createHeader();
    this.createContainer();
    this.createFooter();

    this.$root.appendTo('body');
  }
  
  bind () {
    this.$root.on('change', 'input[type="checkbox"]', this.checkboxAction.bind(this));
    this.$root.on('click', 'button.mlp-dive', this.diveAction.bind(this));
    this.$root.on('click', 'button.mlp-submit', this.submitAction.bind(this));
    this.$root.on('click', 'button.mlp-cancel', this.cancelAction.bind(this));
  }
  
  checkboxAction(evt) {
    const $this = $(evt.currentTarget),
          checked = $this.prop('checked'),
          id = $this.val(), 
          name = $this.data('name'),
          pid = $this.data('parent'),
          $children = this.$root.find(`[data-belong="${id}"] input[type="checkbox"]`);
    if (checked) {
      if (this.selected.length < this.limit) {
        this.selected.push({id: id, name: name});
        if ($children.length !== 0) {
          $children.prop('checked', true).prop('disabled', true);
          let keep = [];
          this.selected.forEach((s, i) => {
            console.log(JSON.stringify(this.selected));
            if (this.$root.find(`[data-belong="${id}"] input[value="${s.id}"]`).length == 0) { keep.push(s); }
          });
          this.selected = keep;
        } 
      }else{
        $this.prop('checked', false);
        return false;
      }  
    }else{
      this.selected.forEach((s, i) => {
        if (s.id == id) this.selected.splice(i, 1);
      })
      if ($children.length !== 0) {
        $children.prop('checked', false).prop('disabled', false);
      }  
    }  
    this.$selectedNotice.find('span').text(this.selected.length);
  } 
  diveAction(evt) {
    const $this = $(evt.currentTarget),
          pos = {level: $this.data('level'), name: $this.data('name'), id: $this.data('id')}, 
          $target = this.$root.find(`.mlp-container[data-belong="${pos.id}"]`);
    $this.find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
    $target.toggleClass('__active');
    this.$root.find(`[data-level="${pos.level+1}"]:not([data-belong="${pos.id}"])`).removeClass('__active').css('min-height', 0);

    this.path.splice(pos.level-1, 1, {id: pos.id, name: pos.name});
     
  }
  submitAction(evt) {
    this.trigger('submit', this.selected);
    this.hide();
  }
  cancelAction() {
    this.hide();
  }
  createHeader () {
    const $header = $(`<div class="mlp-header">`);
    //create title
    const $title = $(`<strong class="mlp-title">${this.config.title}</strong>`)
    $title.appendTo($header);

    //create selected number display
    if (this.config.limit > 0) {
      this.$selectedNotice = $(`<div class="mlp-count">已選擇：<span class="mlp-current-selected">0</span>/${this.limit}</div>`);
    }
    this.$selectedNotice.appendTo($header);
    $header.prependTo(this.$root);
  }

  createContainer () {
    //create items selector wrapper
    this.$selector = $('<div class="mlp-selector"></div>');
    this.$selector.appendTo(this.$root);
    
    //create items tree
    const $top = $(`<ul class="mlp-level" data-level="1">`);
    this.config.source.forEach(itm => {
      const depth = 1
      this.createItm(itm, depth).appendTo($top); 
    });
    $top.appendTo(this.$selector);
  }

  createFooter() {
    const $footer = $(`<div class="mlp-footer">`);  

    this.$cancel = $('<button class="mlp-cancel btn btn-md btn-secondary">取消</button>') 
    this.$submit = $('<button class="mlp-submit btn btn-md u-btn-primary">確認送出</button>')
    this.$cancel.appendTo($footer);
    this.$submit.appendTo($footer);
    $footer.appendTo(this.$root);
  }
  createItm(itm, depth, pdata) {
    this.depth = (depth > this.depth)?depth:this.depth;

    const $itm = $(`<li class="mlp-itm"></li>`); 
    const $div = $(`<div class="mlp-single"></div>`);
    const $label = $(`<label class="mlp-label u-check" for="${this.config.id}-${itm.id}">${itm.name}</label>`);
    
    if (!this.config.acceptLevel || depth == this.config.acceptLevel) {
      const $checkbox = $(`<input type="checkbox" value="${itm.id}" data-name="${itm.name}" id="${this.config.id}-${itm.id}" class="mlp-checkbox g-hidden-xs-up"><div class="u-check-icon-checkbox-v4 g-absolute-centered--y g-left-0"><i class="fa" data-check-icon=""></i></div>`); 
      $label.addClass('__accept');
      $checkbox.prependTo($label);
    }
    $label.appendTo($div);
    $div.appendTo($itm); 

    if (itm.children !== null) {
      depth++;
      const $dive = $(`<button class="mlp-dive" data-level="${depth-1}"data-name="${itm.name}" data-id="${itm.id}"><i class="fa fa-angle-down"></i></button>`);
      $dive.appendTo($div);
      const $container = $(`<div class="mlp-container" data-level="${depth}" style="overflow: hidden; height: 0;">`);
      const $wrap = $(`<ul class="mlp-level"></ul></div>`);
      $container.attr('data-belong', itm.id);

      itm.children.forEach(c => {
        this.createItm(c, depth, itm).appendTo($wrap);
      });
      $wrap.appendTo($container);
      $container.appendTo($itm);
    }

    return $itm;
  }

  show () {
    this.$root.show();    
  }
  hide () {
    this.$root.hide();    
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
