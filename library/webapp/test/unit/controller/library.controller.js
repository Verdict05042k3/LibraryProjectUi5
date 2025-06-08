/*global QUnit*/

sap.ui.define([
	"ui5/library/controller/library.controller"
], function (Controller) {
	"use strict";

	QUnit.module("library Controller");

	QUnit.test("I should test the library controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
