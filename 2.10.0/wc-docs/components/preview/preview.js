import Template from './template.js';
import CSS from '../../constructable-spectrum.js';
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
    this.shadowRoot.adoptedStyleSheets = CSS.getComponentSheets(this.currentComponent).concat(CSS.getSheets('./css/docs.css'));
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open'});
    this.shadowRoot.innerHTML = Template.render();
    this.dom = Template.map(this.shadowRoot);
    this.component = null;
  }

  set component(comp) {
    this.currentComponent = comp;

    let uri;
    if (comp) {
      const file = comp.url.split('/')[comp.url.split('/').length-1];
      this.dom.title.innerHTML = comp.label;
      uri = `htmldocs/${comp.component}/${file}`;
    } else {
      this.dom.title.innerHTML = 'What is Constructable Spectrum?';
      uri = 'about.html';
    }

    fetch( uri)
      .then(response => {
        return response.text();
      })
      .then(html => {
        this.dom.content.innerHTML = html;
        this.shadowRoot.adoptedStyleSheets = CSS.getComponentSheets(comp.component).concat(CSS.getSheets('./css/docs.css'));
        Icons.populateSVG(this.shadowRoot);
      });
  }
}

if (!customElements.get('spectrum-wc-preview')) {
  customElements.define('spectrum-wc-preview', Preview);
}
