export default {
  render() {
    return `${this.html()}`;
  },

  map(scope) {
    return {
      content: scope.querySelector('#component-content'),
      title: scope.querySelector('#component-title'),
      container: scope.querySelector('#container'),
    }
  },

  html() {
    return `<div id="container">
            <h2 id="component-title" class="sdldocs-component-name spectrum-Heading--pageTitle"></h2>
            <section class="cssdocs-example">
                <div id="component-content" class="cssdocs-example-demo"></div>
             </section>
            </div>`;
  }
}
