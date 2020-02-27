define([
    'underscore',
    'Magento_Sales/order/create/form',
    'prototype'
], function (_) {
    'use strict';

    return {

        callbackKeys: [],

        onOrderItemGridReload: function(callbackKey, callback){
            this.onReloadAreas(callbackKey, callback);
            this.onReloadItems(callbackKey, callback);
        },

        onReloadItems: function(callbackKey, callback){
            let itemsCallbackKey = 'items-' + callbackKey;
            if(_.contains(this.callbackKeys, itemsCallbackKey)){
                return this;
            }
            this.callbackKeys.push(itemsCallbackKey);

            let originalItemsLoaded = window.order.itemsLoaded;
            window.order.itemsLoaded = function(){
                originalItemsLoaded();
                callback();
            }.bind(this);

            return this;
        },

        onReloadAreas: function(callbackKey, callback){
            let areasCallbackKey = 'areas-' + callbackKey;
            if(_.contains(this.callbackKeys, areasCallbackKey)){
                return this;
            }
            this.callbackKeys.push(areasCallbackKey);

            let originalAreasLoaded = window.order.areasLoaded;
            window.order.areasLoaded = function(){
                originalAreasLoaded();
                callback();
            }.bind(this);

            return this;
        },

        initAreaReloadCallback: function(callBackKey, areaId, callback) {
            let areaCallbackKey = 'area-' + areaId + '-' + callBackKey;
            let callbackName = areaCallbackKey + 'Callback';
            // prevent duplicate callback registrations
            if(!$(areaId).beeCallbackNames){
                $(areaId).beeCallbackNames = [];
            } else if(_.contains($(areaId).beeCallbackNames, areaCallbackKey)){
                return;
            }

            $(areaId).beeCallbackNames.push(areaCallbackKey);

            // figure out previous callback
            let previousCallbackName = $(areaId).callback;
            let previousCallbackFunction;
            if (previousCallbackName) {
                previousCallbackFunction = window.order[previousCallbackName];
            } else {
                // dummy previous in case there was none
                previousCallbackFunction = function () {};
            }

            // setup to call the new callback after the original callback
            $(areaId).callback = callbackName;
            window.order[callbackName] = function () {
                previousCallbackFunction();
                callback();
            }.bind(this);
            return this;
        }

    };
});
