export default {
  render(items) {
    return `${this.css()}
            ${this.html(items)}`;
  },

  map(scope) {
    return {
      container: scope.querySelector('nav')
    }
  },

  html(items) {
    return `<nav class="spectrum">
              <ul class="spectrum-SideNav">
                ${this.renderItems(items)}
              </ul>
            </nav>`;
  },

  renderItems(items) {
    let render = ``;
    items.forEach( (item, index) => {
      render += `<li class="spectrum-SideNav-item">
                    <a class="spectrum-SideNav-itemLink" data-index="${index}">${item.label}</a>
                 </li>`;
    });
    return render;
  },

  css() {
    return `<style>
                :host {
                    height: 100%;
                    overflow-y: scroll;
                }
                
                nav {
                    display: inline-block;
                }
            </style>`;
  }
}
