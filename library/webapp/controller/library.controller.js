sap.ui.define([
      "./BaseController"
],
function (BaseController) {
    "use strict";

    return BaseController.extend("ui5.library.controller.library", {
        onInit: function () {

        },
        onPressManageBook() {
            this.getRouter().navTo("Category");
        }
    });
});
