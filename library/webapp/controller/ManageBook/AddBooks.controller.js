sap.ui.define([
    "ui5/library/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "ui5/library/model/models",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, models, MessageToast, MessageBox) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.AddBooks", {

        onInit: function () {
            this.setModel(models.AddBook(), "sectionsModel");
            this.setModel(models.validateBook(), "validateBookModel");
        },

        onAddBook: function () {
            var oModel = this.getView().getModel("sectionsModel");
            var aSections = oModel.getProperty("/sections");

            var iCount = aSections.length + 1;
            var oNewSection = {
                id: iCount,
                title: "Book " + iCount,
                subSections: [{
                    subTitle: "Section " + iCount,
                    BookId: "",
                    CatId: "",
                    Title: "",
                    Author: "",
                    Publisher: "",
                    Year: "",
                    Quantity: ""
                }]
            };

            aSections.push(oNewSection);
            oModel.setProperty("/sections", aSections);
        },

        _validate: function () {
            const oSectionsModel = this.getView().getModel('sectionsModel');
            const aSections = oSectionsModel.getProperty('/sections');
            const oValidationModel = this.getView().getModel('validateBookModel');

            // Reset validate model
            const oValidationData = {};

            // Validate từng section
            aSections.forEach((oSection, iIndex) => {
                oSection.subSections.forEach((oSubSection, jIndex) => {
                    const sPath = `/Section${iIndex}_SubSection${jIndex}`;

                    oValidationData[sPath] = {
                        Title: !!oSubSection.Title && oSubSection.Title.trim() !== "",
                        Author: !!oSubSection.Author && oSubSection.Author.trim() !== "",
                        Publisher: !!oSubSection.Publisher && oSubSection.Publisher.trim() !== "",
                        Year: !!oSubSection.Year && oSubSection.Year.trim() !== "",
                        Quantity: !!oSubSection.Quantity && oSubSection.Quantity.trim() !== ""
                    };
                });
            });

            // Cập nhật lại validate model
            oValidationModel.setData(oValidationData);

            // Kiểm tra tổng hợp
            let bIsValid = true;

            for (const sSectionKey in oValidationData) {
                if (oValidationData.hasOwnProperty(sSectionKey)) {
                    const oFields = oValidationData[sSectionKey];

                    for (const sField in oFields) {
                        if (oFields.hasOwnProperty(sField) && !oFields[sField]) {
                            bIsValid = false;
                            break;
                        }
                    }
                    if (!bIsValid) {
                        break;
                    }
                }
            }

            return bIsValid;
        },

        onSave: function () {
            var oModel = this.getView().getModel("sectionsModel");
            var aSections = oModel.getProperty("/sections");

            console.log("Payload to save:", aSections);
            if (!this._validate()) {
                MessageBox.error("Please fill in all required fields.");
                return;
            }

            // Giả lập lưu dữ liệu
            console.log("Saving books:", aSections);

            // Hiển thị thông báo thành công
            MessageToast.show("Books saved successfully!");

            // Reset model sau khi lưu
            oModel.setProperty("/sections", []);

            // Reset validate model
            this.getView().getModel("validateBookModel").setData({});
        },

        formatValueState: function (iSectionId, oValidateModel, sField) {
            if (!oValidateModel) {
                return "None";
            }

            var sPath = `/Section${iSectionId - 1}_SubSection0`;
            var oSectionValidate = oValidateModel[sPath];

            if (oSectionValidate && oSectionValidate[sField]) {
                return "None";
            } else {
                return "Error";
            }
        }

    });
});
