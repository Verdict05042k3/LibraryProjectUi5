sap.ui.define([
      "./BaseController",
      "sap/ui/model/json/JSONModel",
],
function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("ui5.library.controller.library", {
        onInit: function () {

        },
        onPressManageBook() {
            this.getRouter().navTo("Category");
        }
    });
});
