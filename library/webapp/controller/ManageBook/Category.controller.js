
sap.ui.define([
    "ui5/library/controller/BaseController", 
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], function (BaseController, JSONModel, Fragment) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.Category", {

        onInit: function () {
            var oModel = this.getOwnerComponent().getModel();
            var oView = this.getView();

            oModel.read("/CategorySet/$count", {
                success: function (oData) {
                    oView.setModel(new JSONModel({ count: oData }), "CategoryCount");
                },
                error: function (oError) {
                    console.error("Error fetching categories:", oError);
                }
            });
        },
        _loadDialog(sFragmentName) {
            return new Promise((resolve) => {
                Fragment.load({
                    id: this.getView().getId(),
                    name: `ui5.library.view.fragments.${sFragmentName}`,
                    controller: this
                }).then((oDialog) => {
                    this.getView().addDependent(oDialog);
                    resolve(oDialog);
                });
            });
        },
        onPressAddCategory(){
            if(!this._oCategoryDialog){
                this._loadDialog("AddCategory").then((oDialog) => {
                    this._oCategoryDialog = oDialog;
                    oDialog.open();
                })
            }
            else {
                this._oCategoryDialog.open();
            }
        },
        onCancelAddCategory() {
            this._oCategoryDialog.close();
        }
    });
});