import { $ } from "@core/dom";

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector); // это контейнер с div #app
    this.components = options.components || []; //здесь компоненты - тулбар, хедер, таблица и формула
  }

  getRoot() {
    const $root = $.create('div', 'excel')

    this.components = this.components.map(Component => {
      const $el = $.create('div', Component.className)
      const component = new Component($el);
      // DEBUG
      // if(component.name) {
      //   window['c' + component.name] = component;
      // }
      $el.html(component.toHTML());
      $root.append($el);
      return component;
    });

    return $root;
  }

  render() {
    this.$el.append(this.getRoot());
    this.components.forEach(component => component.init());
  }
}