(function() {
  'use strict';

  const supportsAdoptedStyleSheets = 'adoptedStyleSheets' in document;  
  
  if (!supportsAdoptedStyleSheets) {
    function hasImports(content) {
      return content.replace(/\s/g, '').match(/\@import/);
    }

    function replaceSync(contents) {
      if (hasImports(contents)) {
        throw new Error('@import is not allowed when using CSSStyleSheet\'s replaceSync method');
      }
      if (this[node]) {
        this[node]._sheet.innerHTML = contents;
        updateAdopters(this);
        return this[node]._sheet.sheet;
      } else {
        throw new TypeError('replaceSync can only be called on a constructed style sheet');
      }
    }

    function replace(contents) {
      return new Promise((resolve, reject) => {
        if (this[node]) {
          this[node]._sheet.innerHTML = contents;
          resolve(this[node]._sheet.sheet);
          updateAdopters(this);
        } else {
          reject('replace can only be called on a constructed style sheet');
        }
      });
    }

    const node = Symbol('constructible style sheets');
    const constructed = Symbol('constructed');
    const obsolete = Symbol('obsolete');
    const iframe = document.createElement('iframe');
    const mutationCallback = mutations => {
      mutations.forEach(mutation => {
        const { addedNodes, removedNodes } = mutation;
        removedNodes.forEach(removed => {
          if (removed[constructed] && !removed[obsolete]) {
            setTimeout(() => {
              removed[constructed].appendChild(removed);
            });
          }
        });
        
        addedNodes.forEach(added => {
          const { shadowRoot } = added;
          if (shadowRoot && shadowRoot.adoptedStyleSheets) {
            shadowRoot.adoptedStyleSheets.forEach(adopted => {
              shadowRoot.appendChild(adopted[node]._sheet);
            });
          }
        });
      });
    };

    const observer = new MutationObserver(mutationCallback);
    observer.observe(document.body, { childList: true });
    iframe.hidden = true;
    document.body.appendChild(iframe);
    const frameBody = iframe.contentWindow.document.body;

    const appendContent = (location, sheet) => {
      const clone = sheet[node]._sheet.cloneNode(true);
      location.body ? location = location.body : null;
      clone[constructed] = location;  
      sheet[node]._adopters.push({ location, clone });
      location.appendChild(clone);
      return clone;
    };

    const updateAdopters = sheet => {
      sheet[node]._adopters.forEach(adopter => {
        adopter.clone.innerHTML = sheet[node]._sheet.innerHTML;
      });
    };

    class _StyleSheet {
      constructor() {
        this._adopters = [];
        const style = document.createElement('style');
        frameBody.appendChild(style);
        this._sheet = style;
        style.sheet[node] = this;
        if (!style.sheet.constructor.prototype.replace) {
          style.sheet.constructor.prototype.replace = replace;
          style.sheet.constructor.prototype.replaceSync = replaceSync;
        }
        return style.sheet;
      }
    }

    StyleSheet.prototype.replace = replace;
    CSSStyleSheet.prototype.replace = replace;

    CSSStyleSheet.prototype.replaceSync = replaceSync;
    StyleSheet.prototype.replaceSync = replaceSync;

    window.CSSStyleSheet = _StyleSheet;
    const adoptedStyleSheetsConfig = {
      get() {
          return this._adopted || [];
      },
      set(sheets) {
        const location = this.body ? this.body : this;
        this._adopted = this._adopted || [];
        const observer = new MutationObserver(mutationCallback);
        observer.observe(this, { childList: true });
        if (!Array.isArray(sheets)) {
          throw new TypeError('Adopted style sheets must be an Array');
        }
        sheets.forEach(sheet => {
          if (!sheet instanceof CSSStyleSheet) {
            throw new TypeError('Adopted style sheets must be of type CSSStyleSheet');
          }
        });
        const uniqueSheets = [...new Set(sheets)];
        const removedSheets = this._adopted.filter(sheet => !uniqueSheets.includes(sheet));
        removedSheets.forEach(sheet => {
          const styleElement = sheet[node]._adopters.filter(adopter => adopter.location === location)[0].clone;
          styleElement[obsolete] = true;
          styleElement.parentNode.removeChild(styleElement);
        });
        this._adopted = uniqueSheets;
        
        if (this.isConnected) {
          sheets.forEach(sheet => {
            appendContent(this, sheet);
          });
        }
      }
    };

    Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', adoptedStyleSheetsConfig);
    Object.defineProperty(Document.prototype, 'adoptedStyleSheets', adoptedStyleSheetsConfig);
  }
}(undefined));
