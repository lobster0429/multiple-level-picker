class MultipleLevelPickerV2 {
  constructor(config) {
    const defaultConfig  = {
      prefix: '',
      title: '',
      limit: 1,
      width: '90%',
      maxWidth: '250px',
      selectLowest: false,
      selectedValue: [],
    }

    this.data = datav2;


    this.config = $.extend({}, defaultConfig, config);
    this.rootData = this.config.rootData;
    this.limit = this.config.limit;
    this.chosen = [];
    this.path = [];
    this.selectedValue = this.config.selectedValue;
    this.init();
  }

  init () {
    this.render();  
    this.bind();
  }

  render() {
    this.$root = $(`<div id="${this.config.prefix}-multiple-level-picker" class="multiple-level-picker">`); 
    $.each(this.basic, (p, fn) => fn());

    this.$layers = [];
    this.layer(this.rootData, '全部服務');
    this.$root.appendTo($('body'));
  }

  bind() {
    this.$root.on('click', '.mlp-forward', this.events.forward.bind(this));
    this.$root.on('click', '.mlp-tab', this.events.jump.bind(this));
  }

  events = {
    forward: (evt) => {
      evt.preventDefault(); 
      const f = evt.currentTarget.dataset.forward,
            from = evt.currentTarget.dataset.from;
      this.layer(this.data[f], from , true);
    },
    jump: (evt) => {
      evt.preventDefault();
      const t = evt.currentTarget.dataset.tab,
            index = this.path.indexOf(t) + 1,
            removed = this.path.splice(index);
      removed.forEach(r => {
        this.$root.find(`.mlp-layer[data-name="${r}"]`).remove();
      })
      this.tabs();

    }
  }

  basic = {
    header: () => {
      const $header = $(`<div class="mlp-header">`);
      const $title = $(`<strong class="mlp-title">${this.config.title}</string>`)
      this.$limit = $(`<div class="mlp-limit">已選擇：<span class="mlp-count">${this.chosen.length}</span>/${this.limit}</div>`);
      $title.appendTo($header);
      this.$limit.appendTo($header);
      $header.appendTo(this.$root);
    },
    record: () => {
      this.$record = $(`<div class="mlp-record">`);
      this.$record.appendTo(this.$root);
    },
    path: () => {
      this.$nav = $(`<div class="mlp-nav">`);
      this.$nav.appendTo(this.$root);
    },
    container: () => {
      this.$container = $(`<div class="mlp-container">`);
      this.$container.appendTo(this.$root);
    },
    footer: () => {
      const $footer = $(`<div class="mlp-footer">`)
      this.$cancel = $(`<button type="button" class="mlp-cancel btn btn-secondary">取消</button>`);
      this.$submit = $(`<button type="button" class="mlp-submit btn btn-primary">確認送出</button>`);
      this.$cancel.appendTo($footer);
      this.$submit.appendTo($footer);
      $footer.appendTo(this.$root);
    },
  } 

  layer (data, from, effect) {
    const $ul = $(`<ul data-layer="${data.level}" class="mlp-layer" data-name="${from}">`);
    data.data.forEach((u, i) => {
      const $itm = $(`<li class="mlp-itm" data-children="${u.children}" data-pos="1" id="${u.id}"></li>`);
      const $label = $(`<label class="mlp-label u-check">${u.name}</label>`);
      $label.appendTo($itm);

      const checkbox = (!this.config.selectLowest || !u.children);
      if (checkbox) {
        const $checkbox = $(`<input type="checkbox"  value="${u.id}" class="g-hidden-xs-up"><span class="mlp-fcheck u-check-icon-checkbox-v4"><i class="fa" data-check-icon="&#xf00c"></i></span>`);
        $checkbox.appendTo($label);
      }

      if (u.children) {
        const $forward = $(`<button class="mlp-forward" data-from="${u.name}" data-forward="${u.id}"><i class="fa fa-angle-right"></i></button>`);
        $forward.appendTo($itm);
      }

      $itm.appendTo($ul);
    });
    if(effect) {
      $ul.css({
        transform: 'translateX(100%)',
        transition: '.4s cubic-bezier(0, 0, 0, 0.1)',
      });
      const timer = setTimeout(() => {
        $ul.addClass('__slidein');
        clearTimeout(timer);
      }, 200);
    }
    $ul.appendTo(this.$container);
    this.path.push(from);
    this.tabs(effect);
  }

  tabs(effect) {
    this.$nav.html('');
    this.path.forEach((p, i) => {
      const tab = $(`<div class="mlp-tab" data-tab="${p}"><span>${p}</span></div>`) 
      if (i + 1 == this.path.length) {
        if (effect) {
          tab.css({
            opacity: '0',
            transform: 'translateY(3px)',
            transition: '.2s ease-out',
          }) 
          const timer = setTimeout(() => {
            tab.addClass('__active');
            clearTimeout(timer);
          }, 100);
        }else{
          tab.addClass('__active');
        }
      }
      tab.appendTo(this.$nav);
    });  
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
