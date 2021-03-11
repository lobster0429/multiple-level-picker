class MultipleLevelPicker {
  constructor(config) {
    const defaultConfig  = {
      title: '',
      source: [],
      limit: false,
      acceptLevel: false, 
      width: '90%',
      maxWidth: '250px',
      selectorMaxHeight: '300px',
      selectedValue: [],
      mode: 'tree',
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
    this.defaultSelected();
  }

  render () {
    this.$outer = $(`<div class="multiple-level-picker-container" id="${this.config.prefix}-multiple-level-picker">`);
    this.$root = $(`<div class="multiple-level-picker" style="width: ${this.config.width}; max-width: ${this.config.maxWidth};">`)
    if (this.config.mode == 'folder') {
      this.$root.addClass('mlp-mode__folder');
    }else {
      this.$root.addClass('mlp-mode__tree');
    }
    this.createHeader();
    this.createContainer();
    this.createFooter();

    this.$root.appendTo(this.$outer);
    this.$outer.appendTo($('body'));
  }
  
  bind () {
    this.$root.on('change', 'input[type="checkbox"]', this.checkboxAction.bind(this));
    this.$root.on('click', 'button.mlp-toggle',  this.toggleAction.bind(this));
    this.$root.on('click', 'button.mlp-forward', this.forwardAction.bind(this));
    this.$root.on('click', 'div.mlp-backward',   this.backwardAction.bind(this));
    this.$root.on('click', 'button.mlp-submit',  this.submitAction.bind(this));
    this.$root.on('click', 'button.mlp-cancel',  this.cancelAction.bind(this));
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

  toggleAction(evt) {
    const $this = $(evt.currentTarget),
          pos = {level: $this.data('level'), name: $this.data('name'), id: $this.data('id')}, 
          $target = this.$root.find(`.mlp-container[data-belong="${pos.id}"]`);
    $this.find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
    $target.toggleClass('__active');
    this.$root.find(`[data-level="${pos.level+1}"]:not([data-belong="${pos.id}"])`).removeClass('__active').css('min-height', 0);
  }
  
  forwardAction(evt) {
    const $this = $(evt.currentTarget),
          pos = {level: $this.data('level'), name: $this.data('name'), id: $this.data('id')}, 
          $target = this.$root.find(`.mlp-container[data-belong="${pos.id}"]`);

    $target.addClass('__active');
    this.path.push({id: pos.id, name: pos.name});
    this.updatePath();
  }

  backwardAction(evt) {
    const $this = $(evt.currentTarget),
          pos = {level: $this.data('level'), name: $this.data('name'), id: $this.data('id')}; 
    
    $this.parent('.mlp-container').removeClass('__active');
    this.path.splice(-1, 1);
    this.updatePath();
  } 

  submitAction(evt) {
    this.trigger('submit', this.selected);
    this.hide();
  }
  cancelAction() {
    this.hide();
  }
  
  updatePath() {
    this.$path.html('');
    this.path.forEach((p, i, path) => {
      const $unit = $(`<span class="mlp-unit" data-id="${p.id}">${p.name}</span>`);
      if (i > 0 && i < path.length) {
        const $slash = $('<span>/</span>')
        $slash.appendTo(this.$path);
      }
      $unit.appendTo(this.$path);
    });
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

    //create path container
    this.$path = $('<div class="mlp-path" style="background: pink; padding: 10px; clear: both; margin-top: .3em;"></div>');
    this.$path.appendTo($header);

    $header.prependTo(this.$root);
  }

  createContainer () {
    //create items selector wrapper
    this.$selector = $(`<div class="mlp-selector" style="max-height: ${this.config.selectorMaxHeight}"></div>`);
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
    const $div = $(`<div class="mlp-single" style="padding-left: ${(depth - 1) * 1 + 'em'}"></div>`);
    const $label = $(`<label class="mlp-label u-check" for="${this.config.prefix}-${itm.id}">${itm.name}</label>`);
    if (!this.config.acceptLevel || depth == this.config.acceptLevel) {
      const $checkbox = $(`<input type="checkbox" value="${itm.id}" data-name="${itm.name}" id="${this.config.prefix}-${itm.id}" class="mlp-checkbox g-hidden-xs-up"><div class="u-check-icon-checkbox-v4 g-absolute-centered--y g-left-0"><i class="fa" data-check-icon=""></i></div>`); 
      $label.addClass('__accept');
      $checkbox.prependTo($label);
    }
    $label.appendTo($div);
    $div.appendTo($itm); 

    if (itm.children !== null && itm.children.length !== 0) {
      depth++;
      const $toggle = $(`<button class="mlp-toggle" data-level="${depth-1}" data-name="${itm.name}" data-id="${itm.id}"><i class="fa fa-angle-down"></i></button>`);
      $toggle.appendTo($div);

      const $forward = $(`<button class="mlp-forward" data-level="${depth-1}" data-name="${itm.name}" data-id="${itm.id}"><i class="fa fa-angle-right"></i></button>`);
      $forward.appendTo($div);

      const $container = $(`<div class="mlp-container" data-level="${depth}" style="overflow: hidden; height: 0;">`);
      const $backward = $(`<div class="mlp-backward" data-level="${depth-1}" data-name="${itm.name}" data-id="${itm.id}"><i class="fa fa-angle-left" style="margin-right: .5em;"></i>${itm.name}</div>`);

      $backward.appendTo($container);
      const $wrap = $(`<ul class="mlp-level"></ul>`);
      $container.attr('data-belong', itm.id);

      itm.children.forEach(c => {
        this.createItm(c, depth, itm).appendTo($wrap);
      });
      $wrap.appendTo($container);
      $container.appendTo($itm);
    }

    return $itm;
  }

  defaultSelected() {
    const checkedDefault = (this.config.selectedValue.length <= this.limit)
      ? this.config.selectedValue
      : this.config.selectedValue.splice(0, this.limit);

    checkedDefault.forEach(s => {
      this.$root.find(`[value=${s}]`).trigger('click');
    })
  }

  show () {
    this.$outer.show().addClass('__active');;    
  }
  hide () {
    this.$outer.hide().removeClass('__active');    
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
