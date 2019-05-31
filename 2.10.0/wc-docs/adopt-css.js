export default {
    get ERROR_NO_SCOPE_MESSAGE() { return 'No default scope/element offered to use for adopting stylesheet: '; },

    /**
     * get default configuration
     * @returns {{baseURI: string, theme: string}|*}
     */
    get config() {
        return {
            append: [document],
            onSuccess: null,
            onError: function (err, message) {
                console.warn(err, err.message);
            }
        }
    },

    /**
     * adopt a list of sheets or sheet objects
     * @param sheetObjects - array of CSS URLs or objects containing url and scope keys
     * @param defaultScope - scope to adopt CSS like document or shadow root
     * @param config
     */
    adopt(sheetObjects, defaultScope, config) {
        if (!config) {
            config = this.config;
        }
        const scopes = new WeakMap();
        const scopekeys = [];
        if (defaultScope) {
            scopekeys.push(defaultScope);
            scopes.set(defaultScope, { stylesheets: [] });
        }

        // Gather sheets, and resolve to CSSStyleSheet objects
        sheetObjects.forEach( sheet => {
            if (typeof sheet === 'string') {
                if (!defaultScope) {
                    if (config.onError) { config.onError(this.ERROR_NO_SCOPE_MESSAGE + sheet); }
                }
                scopes.get(defaultScope).stylesheets.push( this.getSheet(sheet, config.onSuccess, config.onError) );
            } else {
                let scope;
                if (sheet.scope) {
                    scope = sheet.scope;
                } else if (defaultScope) {
                    scope = defaultScope;
                } else {
                    if (config.onError) { config.onError(this.ERROR_NO_SCOPE_MESSAGE + sheet); }
                }

                if (!scopes.has(scope)) {
                    scopekeys.push(scope);
                    scopes.set(scope, { stylesheets: [] });
                }
                scopes.get(scope).stylesheets.push( this.getSheet(sheet.url, config.onSuccess, config.onError) );
            }
        });

        // Adopt sheet arrays per scope
        scopekeys.forEach( scope => {
            if (config.append.indexOf(scope) !== -1) {
                scope.adoptedStyleSheets = scope.adoptedStyleSheets.concat(scopes.get(scope).stylesheets);
            } else {
                scope.adoptedStyleSheets = scopes.get(scope).stylesheets;
            }
        });
    },

    /**
     * Load or retrieve cached a list of style sheets
     * @param urls
     * @param callback
     * @param error
     * @returns {Array}
     */
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
     * @param url
     * @param callback
     * @param error
     * @returns {CSSStyleSheet|any}
     * @private
     */
    getSheet(url, callback, error) {
        if (!this._dict) {
            this._dict = new Map();
        }
        if (!this._failed) {
            this._failed = new Map();
        }

        if (this._dict.has(url)) {
            return this._dict.get(url);
        } else if (this._failed.has(url)) {
            error.apply(this, [this._failed.get(url)]);
            return this._dict.get(url);
        } else {
            const sheet = new CSSStyleSheet();
            sheet.replace(`@import url("${url}")`)
                .then(sheet => {
                    if (callback) {
                        callback.apply(this, [sheet]);
                    }
                })
                .catch(err => {
                    this._failed.set(url, err);
                    if (error) {
                        error.apply(this, [err]);
                    }
                    return sheet;
                });

            this._dict.set(url, sheet );
            return sheet;
        }
    }
}
