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
     * get url array for a given component
     * @param components
     * @param config
     * @returns {*[]}
     */
    getComponents(components, config) {
        if (!config) { config = this.config; }

        if (!components) {
            components = [];
        }
        if (!Array.isArray(components)) {
            components = [components];
        }

        const sheetRefs = [];

        const core = `${config.baseURI}/spectrum-core.css`;
        const globalvars = `${config.baseURI}/vars/spectrum-global.css`;
        const mediumvars = `${config.baseURI}/vars/spectrum-medium.css`;
        const largevars = `${config.baseURI}/vars/spectrum-large.css`;

        sheetRefs.push( { url: globalvars, scope: document });
        sheetRefs.push( { url: mediumvars, scope: document });
        sheetRefs.push( { url: largevars, scope: document });

        if (config.applyCoreToDocument) {
            sheetRefs.push( { url: core, scope: document });
        }

        sheetRefs.push( core );
        sheetRefs.push( config.themeURI ? config.themeURI : `${config.baseURI}/spectrum-${config.theme}.css` );

        for (let c = 0; c < components.length; c++) {
            const componentvaruri = this.constructComponentLink(config.baseURI, components[c], true);
            const componenturi = this.constructComponentLink(config.baseURI, components[c]);

            // bounce global/root vars to document
            sheetRefs.push( { url: componentvaruri, scope: document });

            // use actual component css on desired scope
            sheetRefs.push(componenturi);
        }
        return sheetRefs;
    }
}
