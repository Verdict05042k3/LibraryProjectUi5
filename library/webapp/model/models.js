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
        }
    }
});