
sap.ui.define([
    "ui5/library/controller/BaseController", 
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "ui5/library/model/models",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, Fragment,models, MessageToast) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.Category", {

        onInit: function () {
            // count of categories to database
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


            // model for add category dialog and validation

            this.setModel(models.addCategory(), "addCategory");
            this.setModel(models.validateCategory(), "validationCategory");
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
        _validate(){

            const oInput = this.getView().getModel('addCategory').getData()
            const oValidationModel = this.getView().getModel('validationCategory')


            oValidationModel.setProperty('/Name', !!oInput.Name)
            oValidationModel.setProperty('/Description', !!oInput.Description)
            oValidationModel.setProperty('/Status', !!oInput.Status)
             // Return validation result
            const oValidationData = oValidationModel.getData()
            for (const sKey in oValidationData) {
                if (oValidationData.hasOwnProperty(sKey) && !oValidationData[sKey]) {
                    return false
                }
            }
            return true
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
        },
        onSaveCategory(){
            const oPayload = this.getView().getModel("addCategory").getData()
            console.log(oPayload)
             // check validation
            if(!this._validate()) return;

            this.getView().getModel().create("/CategorySet", oPayload,{
                success: (oData, oResponse) => {
                    console.log(oData, oResponse)
                    this._oCategoryDialog.close()
                     // Hiển thị MessageBox thành công
                    MessageToast.show("Category created successfully!");

                },
                error: oError => {
                    console.log(oError)
                    this._oCategoryDialog.close()
                     MessageToast.show("Error while creating category!");
                }
            })
        }
    });
});