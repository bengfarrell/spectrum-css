export default {
  render() {
    return `${this.css()}
            ${this.html()}`;
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
  },

  css() {
    return `<style>
                :host {
                    width: 100%;
                    height: 100%;
                    overflow: scroll;
                    background-color: var(--spectrum-alias-background-color-default);
                }
                
                #container {
                    padding: 25px;
                    height: 100%;
                }
                
                .cssdocs-example {
                   margin: 40px;
                }
            </style>`;
  }
}
