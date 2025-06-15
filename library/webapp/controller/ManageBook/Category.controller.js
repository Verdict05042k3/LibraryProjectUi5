
sap.ui.define([
    "ui5/library/controller/BaseController", 
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "ui5/library/model/models",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Fragment,models, MessageToast, MessageBox, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("ui5.library.controller.ManageBook.Category", {

        onInit: function () {
            // count of categories to database
            this._modeButton = ""
            this._countCategory()
            // model for add category dialog and validation
            this.setModel(models.addCategory(), "addCategory");
            this.setModel(models.validateCategory(), "validationCategory");
        },
        // count number category have database table
        _countCategory(){
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
        // load Fragments
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
        // validation data
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
        // display popup add Category
        onPressAddCategory(){

            this._sCategoryMode = "Create"; // Chuyển sang chế độ tạo mới
            this._resetModelCategory();

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
        _resetModelCategory(){
            this.getView().getModel("addCategory").setData({
                CatId:"",
                Name: "",
                Description: "",
                Status: ""
            });
        },
        // cancel popu[]
        onCancelAddCategory() {
            this._resetModelCategory();
            this._oCategoryDialog.close();
        },
        // Save Category create new
        onSaveCategory(){
            const oPayload = this.getView().getModel("addCategory").getData()
            console.log(oPayload)
             // check validation
            if(!this._validate()) return;

            this.getView().getModel().create("/CategorySet", oPayload,{
                success: (oData, oResponse) => {
                    console.log(oData, oResponse)
                    this._oCategoryDialog.close()
                    // Clear dữ liệu input sau khi lưu
                    this._resetModelCategory();
                    // count again category
                    this._countCategory()
                     // Hiển thị MessageBox thành công
                    MessageToast.show("Category created successfully!");
                  
                },
                error: oError => {
                    console.log(oError)
                    this._oCategoryDialog.close()
                     MessageToast.show("Error while creating category!");
                }
            })

        },
        // click button delete data
        onDeleteCategory(oEvent){
        // Lấy binding context của item được click
            var oItem = oEvent.getSource().getParent().getParent(); // Button -> HBox -> ColumnListItem
            var oContext = oItem.getBindingContext();

            // Lấy path của item trong model
            var sPath = oContext.getPath(); // Ví dụ: "/CategorySet/0"

            console.log(sPath)
            
            var sCategoryId = oContext.getProperty("CatId"); // lấy catid của line dữ liệu khi click
            console.log(sCategoryId)
            // check trong BookSet có dữ liệu k, nếu có dữ liệu thì k xoá được báo lỗi luôn
            this._checkBookInCategory(sCategoryId, sPath);

        },
        // call odata delete data
        _deleteCategory: function (sPath) {
            var oModel = this.getView().getModel();
            var oThis = this;
            oModel.remove(sPath, {
                success: function () {
                    // Gọi lại đếm số category sau khi xóa thành công
                    oThis._countCategory();
                    MessageToast.show("Delete Successfully");
                },
                error: function () {
                    MessageToast.show("Delete Failed");
                }
            });

        },
        // check have book in category
        _checkBookInCategory: function (sCategoryId, sPath) {
            var oThis = this;
            var oModel = this.getView().getModel();

            // Tạo filter
            var oFilter = new Filter("CatId", FilterOperator.EQ, sCategoryId);

            oModel.read("/BookSet/$count", {
                filters: [oFilter], // Gán filter vào đây
                success: function (oData) {
                    var iBookCount = parseInt(oData, 10);
                    if (iBookCount > 0) {
                        MessageBox.error("This category is being used in books and cannot be deleted.");
                    } else {
                        MessageBox.confirm("Do you want to delete this category?", {
                            title: "Delete Confirmation",
                            icon: MessageBox.Icon.WARNING,
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            emphasizedAction: MessageBox.Action.YES,
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.YES) {
                                    oThis._deleteCategory(sPath);
                                }
                            }
                        });
                    }
                },
                error: function () {
                    MessageBox.error("Error occurred while checking related books.");
                }
            });
        },
        onEditCategory(oEvent) {
            this._sCategoryMode = "Edit"; // Chuyển sang chế độ chỉnh sửa
          
            var oItem = oEvent.getSource().getParent().getParent(); // Button -> HBox -> ColumnListItem
            var oContext = oItem.getBindingContext();
            var oModel = this.getView().getModel();

            // Lấy path của item trong model (ví dụ: "/CategorySet('3')")
            var sPath = oContext.getPath();
            console.log("Editing path: ", sPath);

            // Đọc dữ liệu từ OData Service
            oModel.read(sPath, {
                success: (oData) => {
                    console.log("Data loaded for edit:", oData);

                    // Set dữ liệu vào model addCategory
                    this.getView().getModel("addCategory").setData({
                        CatId: oData.CatId,
                        Name: oData.Name,
                        Description: oData.Description,
                        Status: oData.Status
                    });

                    // Mở dialog addCategory (có thể tái sử dụng dialog đã có)
                    if (!this._oCategoryDialog) {
                        this._loadDialog("EditCategory").then((oDialog) => {
                            this._oCategoryDialog = oDialog;
                            oDialog.open();
                        });
                    } else {
                        this._oCategoryDialog.open();
                    }
                },
                error: (oError) => {
                    console.error("Error loading category:", oError);
                    MessageToast.show("Error loading category data.");
                }
            });
        },

        onUpdateCategory: function () {
            const oPayload = this.getView().getModel("addCategory").getData();
            console.log("Payload to update: ", oPayload);

            // Check validation
            if (!this._validate()) return;

            // Build update path (bạn cần biết khóa chính, ví dụ ở đây là CategoryId)
            const sCategoryId = oPayload.CatId; // Đảm bảo payload có CategoryId\
            console.log(sCategoryId)
            if (!sCategoryId) {
                MessageToast.show("Missing Category ID for update.");
                return;
            }

            const sUpdatePath = "/CategorySet('" + sCategoryId + "')";

            this.getView().getModel().update(sUpdatePath, oPayload, {
                success: (oData, oResponse) => {
                    console.log("Update success: ", oData, oResponse);

                    this._oCategoryDialog.close();

                    // Clear dữ liệu input sau khi update
                    this._resetModelCategory();

                    // Cập nhật lại số lượng category
                    this._countCategory();

                    // Hiển thị MessageBox thành công
                    MessageToast.show("Category updated successfully!");
                },
                error: (oError) => {
                    console.log("Update error: ", oError);

                    this._oCategoryDialog.close();

                    MessageToast.show("Error while updating category.");
                }
            });
        },
        onSubmitCategory: function () {
            if (this._sCategoryMode === "Create") {
                this.onSaveCategory();
            } else if (this._sCategoryMode === "Edit") {
                this.onUpdateCategory();
            }
        },
        onSearch: function (oEvent) {
            // Nếu người dùng nhấn nút refresh
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
                return;
            }

            var sQuery = oEvent.getParameter("query");
            var aTableSearchState = [];

            // Nếu có từ khóa tìm kiếm
            if (sQuery && sQuery.length > 0) {
                // Tạo filter theo nhiều trường, nối điều kiện OR
                aTableSearchState = [
                    new Filter({
                        filters: [
                            new Filter("Name", FilterOperator.Contains, sQuery)
                        ],
                        and: false // OR condition
                    })
                ];
            }

            // Apply search
            this._applySearch(aTableSearchState);
        },

        onRefresh: function () {
            var oTable = this.byId("productsTable");
            oTable.getBinding("items").refresh();
        },

        _applySearch: function (aTableSearchState) {
            var oTable = this.byId("productsTable");
            var oBinding = oTable.getBinding("items");

            // Apply filter to the binding
            oBinding.filter(aTableSearchState, "Application");

            // Update no data text if no results found
            if (aTableSearchState.length > 0 && oBinding.getLength() === 0) {
                oTable.setNoDataText("No matching categories found.");
            } else {
                oTable.setNoDataText("No categories available.");
            }
        }


    });
});