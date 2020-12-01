class Dom {
  constructor(selector) {
    // #app если селектор строка
    this.$el = typeof selector ==='string' 
    ? document.querySelector(selector)
    // event.target если селектор - дом-нода
    : selector;
  }

  html(html) {
    if (typeof html === 'string') { //если мы передали значение в html(), то он работает как сеттер
      this.$el.innerHTML = html;
      return this;
    }
    // иначе html() работает как геттер
    return this.$el.outerHTML.trim(); //trim() удаляет лишние пробелы в начале и конце строки
  }

  clear() {
    this.html('');
    return this;
  }

  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback)
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback);
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el;
    }
    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }
    return this;
  }
}



export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = '') => {
  const el = document.createElement(tagName)
  if (classes) {
    el.classList.add(classes)
  }
  return $(el);
}
