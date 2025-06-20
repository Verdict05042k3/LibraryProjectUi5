/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
    ],
    function (UIComponent) {
        "use strict";

        return UIComponent.extend("ui5.library.Component", {
            metadata: {
                manifest: "json",
                interfaces: [
                    "sap.ui.core.IAsyncContentCreation"
                ],
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                // enable routing
                this.getRouter().initialize();
            },
            /**
             * This method is called when the component is destroyed.
             * @public
             * @override
             */
            getContentDensityClass: function () {
             // check whether FLP has set the content density class
                if (!this._sContentDensityClass) {
                    if (document.body.classList.contains("sapUiSizeCompact")) {
                        this._sContentDensityClass = "sapUiSizeCompact";
                    } else if (document.body.classList.contains("sapUiSizeCozy")) {
                        this._sContentDensityClass = "sapUiSizeCozy";
                    } else {
                        this._sContentDensityClass = "";
                    }
                }
                return this._sContentDensityClass;
            }
        });
    }
);