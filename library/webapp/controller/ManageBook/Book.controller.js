sap.ui.define([
    "ui5/library/controller/BaseController", 
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.Book", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("Book").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sCatId = oEvent.getParameter("arguments").CatId;
            var sPath = "/CategorySet('" + sCatId + "')";
            var oModel = this.getView().getModel();

            oModel.read(sPath, {
                success: function (oData) {
                    var oBookModel = new JSONModel(oData);
                    this.getView().setModel(oBookModel, "CategoryModel");
                    console.log("Book data loaded successfully:", oData);
                }.bind(this),
                error: function (oError) {
                    console.error("Error reading book data:", oError);
                }
            });
        }
    });
});
