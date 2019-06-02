import Template from './template.js';
import StyleShelter from '../../style-shelter.js';
import Spectrum from '../../constructable-spectrum.js';
import Icons from '../../icons.js';

export default class Preview extends HTMLElement {

  static get observedAttributes() {
    return ['theme'];
  }

  get theme() {
    return this.getAttribute('theme');
  }

  set theme(val) {
    this.setAttribute('theme', val);
  }

  attributeChangedCallback(name, oldval, newval) {
    this.dom.container.classList.remove('spectrum--' + oldval);
    this.dom.container.classList.add('spectrum--' + newval);

    const styles = Spectrum.getComponents(this.currentComponent).concat('./components/preview/preview.css', './css/docs.css');
    StyleShelter.adopt(styles, this.shadowRoot);
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.innerHTML = Template.render();
    this.dom = Template.map(this.shadowRoot);
    this.component = null;
  }

  set component(comp) {

    let uri;
    let component = null;
    if (comp) {
      const file = comp.url.split('/')[comp.url.split('/').length-1];
      component = comp.component;
      this.currentComponent = component;
      this.dom.title.innerHTML = comp.label;
      uri = `htmldocs/${comp.component}/${file}`;
    } else {
      this.currentComponent = null;
      this.dom.title.innerHTML = 'What is Constructable Spectrum?';
      uri = 'about.html';
    }

    fetch( uri)
      .then(response => {
        return response.text();
      })
      .then(html => {
        this.dom.content.innerHTML = html;
        const styles = Spectrum.getComponents(component).concat('./components/preview/preview.css', './css/docs.css');
        StyleShelter.adopt(styles, this.shadowRoot);
        Icons.populateSVG(this.shadowRoot);
      });
  }
}

if (!customElements.get('spectrum-wc-preview')) {
  customElements.define('spectrum-wc-preview', Preview);
}
