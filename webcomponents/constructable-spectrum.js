export default {
    // COMPONENTS
    get ACCORDION() { return 'accordion'; },
    get ACTIONMENU() { return 'actionmenu'; },
    get ALERT() { return 'alert'; },
    get ASSET() { return 'asset'; },
    get ASSETLIST() { return 'assetlist'; },
    get AVATAR() { return 'avatar'; },
    get BANNER() { return 'banner'; },
    get BARLOADER() { return 'barloader'; },
    get BREADCRUMB() { return 'breadcrumb'; },
    get BUTTON() { return 'button'; },
    get BUTTONGROUP() { return 'buttongroup'; },
    get CALENDAR() { return 'calendar'; },
    get CARD() { return 'card'; },
    get CHECKBOX() { return 'checkbox'; },
    get CIRCLELOADER() { return 'circleloader'; },
    get COACHMARK() { return 'coachmark'; },
    get CYCLEBUTTON() { return 'cyclebutton'; },
    get DECORATEDTEXTFIELD() { return 'decoratedtextfield'; },
    get DIALOG() { return 'dialog'; },
    get DROPDOWN() { return 'dropdown'; },
    get DROPINDICATOR() { return 'dropindicator'; },
    get DROPZONE() { return 'dropzone'; },
    get FIELDGROUP() { return 'fieldgroup'; },
    get FIELDLABEL() { return 'fieldlabel'; },
    get ILLUSTRATEDMESSAGE() { return 'illustratedmessage'; },
    get INPUTGROUP() { return 'inputgroup'; },
    get LABEL() { return 'label'; },
    // Is link legacy? get LINK() { return 'link'; },
    get MENU() { return 'menu'; },
    get MILLER() { return 'miller'; },
    get PAGE() { return 'page'; },
    get PAGINATION() { return 'pagination'; },
    get POPOVER() { return 'popover'; },
    get QUICKACTION() { return 'quickaction'; },
    get RADIO() { return 'radio'; },
    get RATING() { return 'rating'; },
    get RULE() { return 'rule'; },
    get SEARCH() { return 'search'; },
    get SEARCHWITHIN() { return 'searchwithin'; },
    get SIDENAV() { return 'sidenav'; },
    get SLIDER() { return 'slider'; },
    get SPLITBUTTON() { return 'splitbutton'; },
    get SPLITVIEW() { return 'splitview'; },
    get STATUSLIGHT() { return 'statuslight'; },
    get STEPLIST() { return 'steplist'; },
    get STEPPER() { return 'stepper'; },
    get TABLE() { return 'table'; },
    get TABS() { return 'tabs'; },
    get TAGS() { return 'tags'; },
    get TEXTFIELD() { return 'textfield'; },
    get TOAST() { return 'toast'; },
    get TOGGLE() { return 'toggle'; },
    get TOOTLTIP() { return 'tooltip'; },
    get TREEVIEW() { return 'treeview'; },
    get UNDERLAY() { return 'underlay'; },
    get WELL() { return 'well'; },

    /**
     * get default configuration
     * @returns {{baseURI: string, theme: string}|*}
     */
    get config() {
        if (!this._config) {
            this._config = {
                theme: 'light',
                themeURI: null,
                baseURI: './spectrum',
                applyCoreToDocument: true
            };
        }
        return this._config;
    },

    /**
     * create a URI to a component file inside Spectrum
     * @param baseURI
     * @param name
     * @param isVar
     * @returns {string}
     */
    constructComponentLink(baseURI, name, isVar) {
        return `${baseURI}/components/${name}/index${isVar ? '-vars' : ''}.css`;
    },

    /**
     * get CSSStyleSheet array for a given component
     * @param components
     * @param callback
     * @param error
     * @param config
     * @returns {*[]}
     */
    getComponentSheets(components, callback, error, config) {
        if (!config) { config = this.config; }

        if (!components) {
            components = [];
        }
        if (!Array.isArray(components)) {
            components = [components];
        }

        const core = this.getSheet(`${config.baseURI}/spectrum-core.css`);
        const globalvars = this.getSheet(`${config.baseURI}/vars/spectrum-global.css`);
        const mediumvars = this.getSheet(`${config.baseURI}/vars/spectrum-medium.css`);
        const largevars = this.getSheet(`${config.baseURI}/vars/spectrum-large.css`);

        if (document.adoptedStyleSheets.indexOf(globalvars) === -1) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.concat(globalvars);
        }

        if (document.adoptedStyleSheets.indexOf(mediumvars) === -1) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.concat(mediumvars);
        }

        if (document.adoptedStyleSheets.indexOf(largevars) === -1) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.concat(largevars);
        }

        if (config.applyCoreToDocument && document.adoptedStyleSheets.indexOf(core) === -1) {
            document.adoptedStyleSheets = document.adoptedStyleSheets.concat(core);
        }

        // allow custom/configurable theme URI
        const theme = config.themeURI ?
        this.getSheet(config.themeURI) :
        this.getSheet(`${config.baseURI}/spectrum-${config.theme}.css`);

        const sheets = [core, theme];
        for (let c = 0; c < components.length; c++) {
            const componentvaruri = this.constructComponentLink(config.baseURI, components[c], true);
            const componenturi = this.constructComponentLink(config.baseURI, components[c]);
            const compvarsheet = this.getSheet(componentvaruri, callback, error);

            // bounce global/root vars to document
            if (document.adoptedStyleSheets.indexOf(compvarsheet) === -1) {
                document.adoptedStyleSheets = document.adoptedStyleSheets.concat(compvarsheet);
            }
            sheets.push(this.getSheet(componenturi, callback, error));
        }
        return sheets;
    },

    getSheets(urls, callback, error) {
        if (!Array.isArray(urls)) {
            urls = [urls];
        }
        const sheets = [];
        for (let c = 0; c < urls.length; c++) {
            sheets.push(this.getSheet(urls[c], callback, error));
        }
        return sheets;
    },

    /**
     * Load or retrieve cached style sheet
     * @param uri
     * @param callback
     * @param error
     * @returns {CSSStyleSheet|any}
     * @private
     */
    getSheet(uri, callback, error) {
        if (!this._dict) {
            this._dict = new Map();
        }
        if (!this._failed) {
            this._failed = new Map();
        }

        if (this._dict.has(uri)) {
            return this._dict.get(uri);
        } else if (this._failed.has(uri)) {
            error.apply(this, [this._failed.get(uri)]);
            return this._dict.get(uri);
        } else {
            const sheet = new CSSStyleSheet();
            sheet.replace(`@import url("${uri}")`)
                .then(sheet => {
                    if (callback) {
                        callback.apply(this, [sheet]);
                    }
                })
                .catch(err => {
                    this._failed.set(uri, err);
                    if (error) {
                        error.apply(this, [err]);
                    }
                    return sheet;
                });

            this._dict.set(uri, sheet );
            return sheet;
        }
    }
}
