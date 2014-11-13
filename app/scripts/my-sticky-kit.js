/*jshint camelcase: false, -W030: false, strict: false */
(function() {
  var $, win;

  $ = this.jQuery;

  win = $(window);

  $.fn.stick_in_parent = function(opts) {
    var elm, inner_scrolling, offset_top, parent_selector, sticky_class, _fn, _i, _len;
    if (opts === null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, parent_selector = opts.parent, offset_top = opts.offset_top;
    if (offset_top === null) {
      offset_top = 0;
    }
    if (parent_selector === null) {
      parent_selector = void 0;
    }
    if (inner_scrolling === null) {
      inner_scrolling = true;
    }
    if (sticky_class === null) {
      sticky_class = 'is_stuck';
    }
    _fn = function(elm, recalc_padding_bottom, parent_top, parent_height, top, height, el_float) {
      var bottomed, detach, fixed, last_pos, offset, parent, recalc, recalc_and_tick, spacer, tick, elem_width, fixed_css, unstick_css;
      var recalc_border_top, recalc_padding_top;

      if (elm.data('sticky_kit')) {
        return;
      }
      elm.data('sticky_kit', true);
      parent = elm.parent();
      if (parent_selector !== null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw 'failed to find stick parent';
      }
      fixed = false;
      bottomed = false;
      spacer = $('<div />');
      spacer.css('position', elm.css('position'));
      elem_width = elm.css('box-sizing') === 'border-box' ? elm.outerWidth() + 'px' : elm.width() + 'px';
      fixed_css = {
        position: 'fixed',
        top: offset_top,
        width: elem_width
      };
      elm.after(spacer);
      spacer.hide();
      unstick_css = {
        position: '',
        width: '',
        top: ''
      };
      recalc_border_top = parseInt(parent.css('border-top-width'), 10);
      recalc_padding_top = parseInt(parent.css('padding-top'), 10);
      recalc_padding_bottom = parseInt(parent.css('padding-bottom'), 10);

      recalc = function() {
        var restore, spacer_display;
        parent_top = parent.offset().top + recalc_border_top + recalc_padding_top;
        parent_height = parent.height();
        restore = fixed ? (fixed = false, bottomed = false, elm.insertAfter(spacer).css({
          position: '',
          top: '',
          width: '',
          bottom: ''
        }), spacer.hide(), true) : void 0;
        top = elm.offset().top - parseInt(elm.css('margin-top'), 10) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css('float');
        spacer_display = elm.css('display');
        if(elm.css('display') === 'block') {
          spacer_display = 'none';
        }
        spacer.css({
          width: elm.outerWidth(true),
          height: height,
          display: spacer_display,
          'vertical-align': elm.css('vertical-align'),
          'float': el_float
        });
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      tick = function() {
        var delta, scroll, will_bottom, win_height;
        scroll = win.scrollTop();
        if (last_pos !== null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          will_bottom = scroll + height + offset > parent_height + parent_top;
          if (bottomed && !will_bottom) {
            bottomed = false;
            elm.css({
              position: 'fixed',
              bottom: '',
              top: offset
            });
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (el_float === 'left' || el_float === 'right') {
              elm.insertAfter(spacer);
            }
            spacer.hide();
            elm.css(unstick_css).removeClass(sticky_class);
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + 'px'
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            elm.css(fixed_css);
            spacer.show();
            if (el_float === 'left' || el_float === 'right') {
              spacer.append(elm);
            }
            // 1ms improved if stick event not used
            //elm.trigger('sticky_kit:stick');
          }
        }
        if (fixed) {
          if (will_bottom === null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css('position') === 'static') {
              parent.css({
                position: 'relative'
              });
            }
            return elm.css({
              position: 'absolute',
              bottom: recalc_padding_bottom,
              top: 'auto'
            });
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      var attach = function() {
        win.on('touchmove', tick);
        win.on('scroll', tick);
        win.on('resize', recalc_and_tick);
        $(document.body).on('sticky_kit:recalc', recalc_and_tick);
        elm.on('sticky_kit:detach', detach);
        elm.off('sticky_kit:attach', attach);
        elm.data('sticky_kit', true);
        recalc_and_tick();
      };
      detach = function() {
        win.off('touchmove', tick);
        win.off('scroll', tick);
        win.off('resize', recalc_and_tick);
        $(document.body).off('sticky_kit:recalc', recalc_and_tick);
        elm.off('sticky_kit:detach', detach);
        elm.on('sticky_kit:attach', attach);
        elm.data('sticky_kit', false);
        elm.css({
          position: '',
          bottom: '',
          top: ''
        });
        parent.position('position', '');
        if (fixed) {
          elm.insertAfter(spacer).removeClass(sticky_class);
          return spacer.hide();
        }
      };
      win.on('touchmove', tick);
      win.on('scroll', tick);
      win.on('resize', recalc_and_tick);
      $(document.body).on('sticky_kit:recalc', recalc_and_tick);
      elm.on('sticky_kit:detach', detach);
      return setTimeout(tick, 0);
    };
    // if the element has previously sticked apply the _fn function
    var firstSticked = false;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      elm = $(this[_i]);
      firstSticked = typeof(elm.data('sticky_kit')) === 'undefined';
      if(firstSticked) {
        _fn(elm);
      } else { // initialize the element
        elm.trigger('sticky_kit:attach');
      }
    }
    return this;
  };
}).call(this);
