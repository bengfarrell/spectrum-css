import Template from './template.js';
import Navigation from '../navigation/navigation.js';
import CSS from '../../adopt-css.js';
import Spectrum from '../../constructable-spectrum.js';
import Icons from '../../icons.js';

export default class App extends HTMLElement {
  constructor() {
    super();
    Spectrum.config.baseURI = this.getAttribute('componentslocation');
    Spectrum.config.theme = 'light';

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
      this.dom.header.classList.remove('spectrum--' + Spectrum.config.theme );
      Spectrum.config.theme = e.currentTarget.value;
      this.dom.preview.theme = e.currentTarget.value;
      this.dom.nav.theme = e.currentTarget.value;
      this.dom.header.classList.add('spectrum--' + Spectrum.config.theme );

      const styles = Spectrum.getComponents([Spectrum.DROPDOWN]).concat('./css/docs.css', './components/app/app.css');
      CSS.adopt(styles, this.shadowRoot);
    });
    Icons.populateSVG(this.shadowRoot);

    this.dom.aboutLink.addEventListener('click', e => {
      this.dom.preview.component = null;
    });

    this.dom.nav.addEventListener(Navigation.ITEM_SELECTED, e => {
      const component = this.components[e.detail.index];
      this.dom.preview.component = component;
    });

    const styles = Spectrum.getComponents([Spectrum.DROPDOWN]).concat('./css/docs.css', './components/app/app.css');
    CSS.adopt(styles, this.shadowRoot);
  }
}

if (!customElements.get('spectrum-wc-app')) {
  customElements.define('spectrum-wc-app', App);
}
