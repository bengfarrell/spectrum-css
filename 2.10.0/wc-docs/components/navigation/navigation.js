import Template from './template.js';
import StyleShelter from '../../style-shelter.js';
import Spectrum from '../../constructable-spectrum.js';

export default class Navigation extends HTMLElement {

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
    this.updateTheme(newval, oldval);
  }

  updateTheme(newval, oldval) {
    if (this.dom) {
      if (oldval) {
        this.dom.container.classList.remove('spectrum--' + oldval);
      }
      this.dom.container.classList.add('spectrum--' + newval);

      const styles = Spectrum.getComponents().concat('./components/navigation/navigation.css', './css/docs.css');
      StyleShelter.adopt(styles, this.shadowRoot);
    }
  }

  static get ITEM_SELECTED() {
    return 'onItemSelected';
  }

  set items(val) {
    this.shadowRoot.innerHTML = Template.render(val);
    this.dom = Template.map(this.shadowRoot);
    this.updateTheme(this.getAttribute('theme') );
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.addEventListener('click', e => this.onClickItem(e));
  }

  onClickItem(e) {
    if (this.selected) {
      this.selected.classList.toggle('is-selected', false);
    }

    if (!e.target.dataset.index) {
      return;
    }

    this.selected = e.target;
    this.selected.classList.toggle('is-selected', true);
    const ce = new CustomEvent(Navigation.ITEM_SELECTED, {
      composed: true,
      bubbles: true,
      detail: {
        index: e.target.dataset.index
      }});
    this.dispatchEvent(ce);
  }
}

if (!customElements.get('spectrum-wc-nav')) {
  customElements.define('spectrum-wc-nav', Navigation);
}
