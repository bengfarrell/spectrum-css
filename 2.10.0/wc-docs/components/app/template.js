import Navigation from '../navigation/navigation.js';
import Preview from '../preview/preview.js';
import Icons from '../../icons.js';
import CSS from '../../constructable-spectrum.js';

export default {
  render() {
    return `${this.html()}`;
  },

  map(scope) {
    return {
      nav: scope.querySelector('spectrum-wc-nav'),
      preview: scope.querySelector('spectrum-wc-preview'),
      themeMenu: scope.querySelector('#colorstop'),
      header: scope.querySelector('header'),
      aboutLink: scope.querySelector('#about')
    }
  },

  html(items) {
    return `<header class="sdldocs-header">
              <div>
                <h2 class="spectrum-Heading--pageTitle">
                  <img class="sdldocs-header-logo-image" src="img/spectrum_logo_light.svg" alt="Adobe Spectrum Logo">
                  <span class="sdldocs-header-title">Constructable Spectrum</span>
                </h2>
                <a href="#" id="about" class="spectrum-Link">What is Constructable Spectrum?</a>
              </div>
              <div class="sdl-switcher">
                <!--<label class="spectrum-FieldLabel spectrum-FieldLabel--left">Scale</label>
                <div class="spectrum-Dropdown">
                  <select class="spectrum-FieldButton spectrum-Dropdown-trigger" onchange="changeScale.apply(this, this[this.selectedIndex].value.split(','))" id="scale">
                    <option value="medium,standalone">Medium</option>
                    <option value="large,standalone">Large</option>
                    <option value="medium,diff">Medium (diff)</option>
                    <option value="large,diff">Large (diff)</option>
                  </select>
                  <svg class="spectrum-Icon spectrum-UIIcon-ChevronDownMedium spectrum-Dropdown-icon">
                    <use xlink:href="#spectrum-css-icon-ChevronDownMedium"></use>
                  </svg>
                </div>-->
                <label class="spectrum-FieldLabel spectrum-FieldLabel--left">Color Theme</label>
                <div class="spectrum-Dropdown">
                  <select class="spectrum-FieldButton spectrum-Dropdown-trigger" id="colorstop">
                    <option value="lightest">Lightest</option>
                    <option selected value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="darkest">Darkest</option>
                  </select>
                  <svg class="spectrum-Icon spectrum-UIIcon-ChevronDownMedium spectrum-Dropdown-icon">
                    ${Icons.ChevronDownMedium}
                  </svg>
                </div>
              </div>
            </header>
            <section>
                <spectrum-wc-nav theme="${CSS.config.theme}"></spectrum-wc-nav>
                <spectrum-wc-preview theme="${CSS.config.theme}"></spectrum-wc-preview> 
            </section>`;
  }
}
