import Template from './template.js';
import Navigation from '../navigation/navigation.js';
import CSS from '../../constructable-spectrum.js';
import Icons from '../../icons.js';

export default class App extends HTMLElement {
  constructor() {
    super();
    CSS.config.baseURI = this.getAttribute('componentslocation');
    CSS.config.theme = 'light';

    this.attachShadow({ mode: 'open'});
    fetch(this.getAttribute('manifest'))
      .then(response => {
        return response.json();
      })
      .then(docs => {
        this.components = docs;
        this.dom.nav.items = docs;
      });

    this.shadowRoot.innerHTML = Template.render();
    this.dom = Template.map(this.shadowRoot);
    this.dom.themeMenu.addEventListener('change', e => {
      this.dom.header.classList.remove('spectrum--' + CSS.config.theme );
      CSS.config.theme = e.currentTarget.value;
      this.dom.preview.theme = e.currentTarget.value;
      this.dom.nav.theme = e.currentTarget.value;
      this.dom.header.classList.add('spectrum--' + CSS.config.theme );
      this.shadowRoot.adoptedStyleSheets = CSS.getComponentSheets([CSS.DROPDOWN]).concat(CSS.getSheets('./css/docs.css'));
    });
    Icons.populateSVG(this.shadowRoot);

    this.dom.aboutLink.addEventListener('click', e => {
      this.dom.preview.component = null;
    });

    this.dom.nav.addEventListener(Navigation.ITEM_SELECTED, e => {
      const component = this.components[e.detail.index];
      this.dom.preview.component = component;
    });

    this.shadowRoot.adoptedStyleSheets = CSS.getComponentSheets([CSS.DROPDOWN]).concat(CSS.getSheets('./css/docs.css'));
  }
}

if (!customElements.get('spectrum-wc-app')) {
  customElements.define('spectrum-wc-app', App);
}
