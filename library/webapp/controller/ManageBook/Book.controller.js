sap.ui.define([
    "ui5/library/controller/BaseController", 
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, Filter, FilterOperator, MessageToast) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.Book", {

        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("Book").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Lấy CatId từ tham số của route
            var sCatId = oEvent.getParameter("arguments").CatId;
            var sPath = "/CategorySet('" + sCatId + "')";
            var oModel = this.getView().getModel();
            // Đọc dữ liệu từ OData service
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

             // Filter BookSet theo CatId
            var oTable = this.byId("bookTable");
            var oBinding = oTable.getBinding("items");
            var oView = this.getView();


            if (oBinding) {
                var oFilter = new Filter("CatId", FilterOperator.EQ, sCatId);
                oBinding.filter([oFilter], "Application");
                console.log("Filter applied to bookTable items:", oFilter);

                oBinding.attachChange(function () {
                    var iCount = oBinding.getLength();
                    
                    oView.setModel(new JSONModel({ count: iCount }), "bookCountModel");
                    console.log("Book count updated:", iCount);
                });

            }
        },
        onDeleteSelectedBooks: function () {
                var oTable = this.byId("bookTable");
                var aSelectedItems = oTable.getSelectedItems(); 
                var oModel = this.getView().getModel();

                if (aSelectedItems.length === 0) {
                    MessageToast.show("No books selected for deletion.");
                    return;
                }

                var aPromises = [];

                aSelectedItems.forEach(function (oItem) {
                    var sPath = oItem.getBindingContext().getPath();

                    // Dùng Promise để xử lý sau khi tất cả đã xoá
                    var oPromise = new Promise(function (resolve, reject) {
                        oModel.remove(sPath, {
                            success: function () {
                                resolve();
                            },
                            error: function () {
                                reject();
                            }
                        });
                    });

                    aPromises.push(oPromise);
                });

                // Sau khi tất cả các bản ghi đã xoá xong
                Promise.all(aPromises)
                    .then(function () {
                        MessageToast.show("Books deleted successfully.");
                        oTable.removeSelections(); 
                    })
                    .catch(function () {
                        MessageToast.show("Error deleting some books.");
                        oTable.removeSelections(); 
                    });
            },
            onAddBook: function () {
                this.getRouter().navTo("AddBooks");
            },
            onBookEditPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var sBookId = oItem.getBindingContext().getProperty("Bookid");
                console.log("Editing book with ID:", sBookId);
                this.getRouter().navTo("EditBook", {
                  
                });
            }

    });
});
