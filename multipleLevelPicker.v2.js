class MultipleLevelPicker {
  constructor(config) {
    const defaultConfig  = {
      prefix: '',
      limit: 1,
      source: null,
      selectLowest: false,
      lang: '1',
      chosen: {},
      text: {
        title: 'Menu',
        count: 'Selected：',
        rootTab: 'All',
        cancelBtn: 'Cancel',
        submitBtn : 'Submit'
      }
    }

    this.config = $.extend({}, defaultConfig, config);
    if (!this.config.source) return false;

    this.limit = this.config.limit;
    this.path = [];
    this.selectedValue = this.config.selectedValue;
    this.callbacks = {
      submit: [],
      update: [],
      cancel: [],
    }   
    this.init();
  }
  
  init () {
    this.render();  
    this.bind();
  }
 
  render() {
    this.$outer = $(`<div id="${this.config.prefix}-multiple-level-picker" class="multiple-level-picker" style="display: none;">`);
    this.$root = $(`<div class="mlp-entity">`); 
    $.each(this.basic, (p, fn) => fn());
    this.$root.appendTo(this.$outer);
    this.$outer.appendTo($('body'));

    //sync data to chosen 
    Object.keys(this.config.chosen).forEach((k, i) => {
      if (i < this.limit) {
        this.chosen.add(k, this.config.chosen[k], this);
      }
      this.chosen.merge();
    });
  }

  bind() {
    this.$root.on('click', '.mlp-forward', this.events.forward.bind(this));
    this.$root.on('click', '.mlp-tab', this.events.jump.bind(this));
    this.$root.on('click', '.mlp-submit', this.events.submit.bind(this));
    this.$root.on('click', '.mlp-cancel', this.events.cancel.bind(this));
    this.$root.on('change', '.mlp-checkbox', this.events.change.bind(this));
    this.$root.on('click', '.mlp-delete', this.events.delete.bind(this));
  }

  events = {
    forward: (evt) => {
      evt.preventDefault(); 
      const f = evt.currentTarget.dataset.forward,
            from = evt.currentTarget.dataset.from;
      this.get(f)
        .then(res => {
          const $p = this.$root.find(`[value="${f}"]`);
          const state = ($p.prop('checked') || $p.prop('disabled'));
          this.layer(res, from, state, true);
        })
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
    },
    submit: (evt) => {
      this.chosen.merge();
      this.hide();
      this.trigger('submit', this.chosen.data);
    },
    cancel: (evt) => {
      this.chosen.restore(this);
      this.hide();
      this.trigger('cancel');
    },
    change: (evt) => {
      evt.preventDefault();
      const $this = $(evt.currentTarget),
            checked = $this.prop('checked'),
            len = this.chosenLen();
      if (checked) {
        if (len < this.config.limit) {
          this.chosen.add($this.val(), $this.data('name'), this);
        }else{
          $this.prop('checked', false);
          return false;
        }
      }else{
        this.chosen.remove($this.val(), this);
      }
    },
    delete: (evt) => {
      evt.preventDefault();
      const $this = $(evt.currentTarget),
            index = $this.data('id');
      this.chosen.remove(index, this);
    }
  }

  chosen = {
    data: {},
    temp: {},
    merge: function () {
      this.data = $.extend({}, this.temp);
    },
    restore: function (self) {
      $.each(this.temp, k => {
        this.remove(k, self);
      });
      $.each(this.data, (i, v) => {
        this.add(i, v, self); 
      });
    },
    add: function(i, v, self) {
      //validate parent and child
      const k = i.toString(),
            lv = k.indexOf('00')/2,
            p = k.slice(0, i.indexOf('00'));

      $.each(this.temp, (d, v) => {
        const sk = d.slice(0, lv * 2);
        if (sk == p) {
          this.remove(d, self);
        }
      });
      this.temp[k] = v;
      this.view(self, 'add', k, v);  
    },
    remove: function(i, self) {
      const k = i.toString();
      delete this.temp[k];
      this.view(self, 'remove', k);
    },
    view: function (self, action, i, v) {
      switch (action) {
        case 'add':
          const $tag = $(`<div class="mlp-tag"><span>${v}</span><a class="mlp-delete" href="javascript:;" data-id="${i}"><i class="fa fa-times"></i></a></div>`);
          $tag.appendTo(self.$record);
          self.$root.find(`[value="${i}"]`).prop('checked', true);
          break;
        case 'remove':
          const keep = i.slice(0, i.indexOf('00'));
          self.$container.find(`[value="${i}"]`).prop('checked', false);
          self.$container.find(`[value^="${keep}"]`).prop('disabled', false);
          self.$record.find(`[data-id="${i}"]`).parent('.mlp-tag').remove();
          break;
        default:
          return false;
          break;
      } 
      self.$root.find('.mlp-count').text(self.chosenLen());
      self.$record.scrollLeft(9999);
      self.trigger('update', self.chosen.temp);
    }
  }
  
  basic = {
    header: () => {
      const $header = $(`<div class="mlp-header">`);
      const $title = $(`<strong class="mlp-title">${this.config.text.title}</string>`)
      this.$limit = $(`<div class="mlp-limit">${this.config.text.count}<span class="mlp-count">${this.chosenLen()}</span>/${this.limit}</div>`);
      $title.appendTo($header);
      this.$limit.appendTo($header);
      $header.appendTo(this.$root);
    },
    path: () => {
      this.$nav = $(`<div class="mlp-nav">`);
      this.$nav.appendTo(this.$root);
    },
    container: () => {
      this.$loader = $('<div class="mlp-loader" style="display: none;"><i class="fa fa-spinner fa-pulse"></i></div>'); 
      this.$container = $(`<div class="mlp-container">`);
      this.$loader.appendTo(this.$container);
      this.$container.appendTo(this.$root);
    },
    record: () => {
      this.$record = $(`<div class="mlp-record">`);
      this.$record.appendTo(this.$root);
    },
    footer: () => {
      const $footer = $(`<div class="mlp-footer">`)
      this.$cancel = $(`<button type="button" class="mlp-cancel btn btn-secondary">${this.config.text.cancelBtn}</button>`);
      this.$submit = $(`<button type="button" class="mlp-submit btn btn-primary">${this.config.text.submitBtn}</button>`);
      this.$cancel.appendTo($footer);
      this.$submit.appendTo($footer);
      $footer.appendTo(this.$root);
    },
  } 

  layer (data, from, disabled, effect) {
    const $ul = $(`<ul data-layer="${data.level}" class="mlp-layer" data-name="${from}">`);
    data.data.forEach((u, i) => {
      const $itm = $(`<li class="mlp-itm" data-children="${u.children}" data-pos="1" id="${u.code}"></li>`);
      const $label = $(`<label class="mlp-label u-check">${u.name}</label>`);
      $label.appendTo($itm);

      const checkbox = (!this.config.selectLowest || !u.children);
      if (checkbox) {
        const dis = (disabled)?'disabled':'';
        const chk = (this.chosen.temp.hasOwnProperty(u.code) && !dis)?'checked':'';
        const $checkbox = $(`<input type="checkbox" value="${u.code}" data-name="${u.name}" ${chk} ${dis} class="mlp-checkbox g-hidden-xs-up"><span class="mlp-fcheck u-check-icon-checkbox-v4"><i class="fa" data-check-icon="&#xf00c"></i></span>`);
        $checkbox.prependTo($label);
      }

      if (u.children) {
        const $forward = $(`<button class="mlp-forward" data-from="${u.name}" data-forward="${u.code}"><i class="fa fa-angle-right"></i></button>`);
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
    const navw = this.$nav.width();
    let tabsw = 0;
    this.$nav.html('');
    this.path.forEach((p, i) => {
      const tab = $(`<div class="mlp-tab" data-tab="${p}"><span>${p}</span></div>`) 
      if (i + 1 == this.path.length) {
        if (effect) {
          const timer = setTimeout(() => {
            tab.addClass('__active');
            clearTimeout(timer);
          }, 100);
        }else{
          tab.addClass('__active');
        }
      }else{
        tab.css({opacity: 1, transform: 'translateY(0)'});
      }
      tab.appendTo(this.$nav);
      tabsw += tab.outerWidth();
    });  
    let diff = tabsw - navw;
    if (diff > 0) {
      this.$nav.find('.mlp-tab').css({
        transform: `translateX(-${diff}px)`
      });  
    }
  } 

  chosenLen() {
    return Object.keys(this.chosen.temp).length;
  }

  get(code) {
    if (this.$loader) this.$loader.fadeIn();
    return new Promise((resolve, reject) => {
      $.ajax({
        url: this.config.source,
        method: 'GET',
        dataType: 'json',
        data: {code: code, lang: this.config.lang} 
      })
        .then(res => {
          if (this.$loader) this.$loader.fadeOut();
          resolve(res);
        })
        .catch(res => {
          reject(res);
          console.error(res);
        });
    })
  }

  show () {
    if(this.$outer) this.$outer.show().addClass('__active');;    
    this.get('000000000000')
      .then(res => {
        this.layer(res, this.config.text.rootTab, false, false);
      });
  }
  hide () {
    this.$outer.hide().removeClass('__active');    
    this.$container.html('');
    this.path = [];
  }
  
  on (a, cb) {
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
