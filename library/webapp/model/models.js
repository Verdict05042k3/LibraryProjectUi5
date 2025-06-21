sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/BindingMode"
], 
function (JSONModel, BindingMode) {
    "use strict";

    return {
        addCategory: function () {
            return new JSONModel({
                CatId:"",
                Name: "",
                Description: "",
                Status: ""
            }).setDefaultBindingMode(BindingMode.TwoWay);
        },

        validateCategory: function () {
            return new JSONModel({
                Name:true,
                Description: true,
                Status: true
            }).setDefaultBindingMode(BindingMode.TwoWay);
        },

        AddBook: function () {
            return new JSONModel({
                BookId: "",
                CatId: "",
                Title: "",
                Author: "",
                Publisher: "",
                Year: "",
                Quantity: ""
            }).setDefaultBindingMode(BindingMode.TwoWay);
        },
        validateBook: function () {
            return new JSONModel({
                Title: true,
                Author: true,
                Publisher: true,
                Year: true,
                Quantity: true
            });
        }
    };
});