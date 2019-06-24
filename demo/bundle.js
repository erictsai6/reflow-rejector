(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    var EAlertType;
    (function (EAlertType) {
        EAlertType["ALERT"] = "ALERT";
        EAlertType["CONSOLE"] = "CONSOLE";
    })(EAlertType || (EAlertType = {}));
    var DEFAULT_MAX_ALLOWED = 10;
    var DEFAULT_BUFFER_MS = 1500;
    var DEFAULT_ALERT_TYPE = EAlertType.ALERT;
    var DEFAULT_CONFIG = {
        maxAllowed: DEFAULT_MAX_ALLOWED,
        bufferMs: DEFAULT_BUFFER_MS,
        alertType: DEFAULT_ALERT_TYPE
    };
    var Buffer = /** @class */ (function () {
        function Buffer(config) {
            this.setConfig(config);
        }
        Buffer.getInstance = function () {
            if (!Buffer._instance_) {
                Buffer._instance_ = new Buffer();
            }
            return Buffer._instance_;
        };
        Buffer.prototype.setConfig = function (config) {
            config = config || {};
            var mergedConfig = __assign({}, DEFAULT_CONFIG, config);
            this.interval = null;
            this.eventsQueue = [];
            this.maxAllowed = mergedConfig.maxAllowed;
            this.bufferMs = mergedConfig.bufferMs;
            this.alertType = mergedConfig.alertType;
        };
        Buffer.prototype.addEvent = function (event) {
            this.eventsQueue.push(event);
        };
        Buffer.prototype.startInterval = function () {
            var _this = this;
            this.interval = setInterval(function () {
                if (_this.eventsQueue.length > _this.maxAllowed) {
                    _this.alertDeveloper();
                }
                // Reset the events queue
                _this.eventsQueue.length = 0;
            }, this.bufferMs);
        };
        Buffer.prototype.stopInterval = function () {
            clearInterval(this.interval);
        };
        Buffer.prototype.alertDeveloper = function () {
            if (this.alertType === EAlertType.ALERT) {
                alert(this.generateAlertMessage());
            }
            console.error(this.eventsQueue);
        };
        Buffer.prototype.generateAlertMessage = function () {
            return "Reflow detector triggered\n\n\n            Saw " + this.eventsQueue.length + " event(s) within " + this.bufferMs + " ms.\n \n            Please see console for more details.";
        };
        return Buffer;
    }());

    /**
     *
     * @param originalProperty - renames original property name
     *
     * @example 'offsetLeft' will now be converted to '_original_offsetLeft_'
     */
    function getRenamedProperty(originalProperty) {
        return "_original_" + originalProperty + "_";
    }

    var buffer = Buffer.getInstance();
    // Reference link: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    var ELEMENT_PROPERTIES = [
        // Box metrics
        'offsetLeft',
        'offsetTop',
        'offsetWidth',
        'offsetHeight',
        'offsetParent',
        'getClientRects',
        'getBoundingClientRect',
        // Scroll - need to differentiate setters
        'scrollWidth',
        'scrollHeight',
        'scrollLeft',
        'scrollTop'
    ];
    function elementWrapper() {
        for (var _i = 0, ELEMENT_PROPERTIES_1 = ELEMENT_PROPERTIES; _i < ELEMENT_PROPERTIES_1.length; _i++) {
            var property = ELEMENT_PROPERTIES_1[_i];
            defineElementProperty(property);
        }
    }
    function defineElementProperty(property) {
        var renamedPropertyName = getRenamedProperty(property);
        var originalImplementation = Object.getOwnPropertyDescriptor(HTMLElement.prototype, property);
        if (!originalImplementation) {
            console.warn("Invalid element property passed in: " + property + " - could be a browser thing.");
            return;
        }
        Object.defineProperty(HTMLElement.prototype, renamedPropertyName, originalImplementation);
        Object.defineProperty(HTMLElement.prototype, property, {
            get: function () {
                var stacktrace = (new Error()).stack;
                buffer.addEvent({
                    type: property,
                    stacktrace: stacktrace
                });
                return this[renamedPropertyName];
            }
        });
    }

    var ReflowRejector = /** @class */ (function () {
        function ReflowRejector() {
        }
        ReflowRejector.initialize = function (config) {
            var buffer = Buffer.getInstance();
            buffer.setConfig(config);
            elementWrapper();
            buffer.startInterval();
        };
        ReflowRejector.teardown = function () {
            var buffer = Buffer.getInstance();
            buffer.stopInterval();
        };
        return ReflowRejector;
    }());

    ReflowRejector.initialize();
    var appContainer = document.getElementById('app');
    var divList = [];
    for (var i = 0; i < 20; i++) {
        var div = document.createElement('div');
        var anchor = document.createElement('a');
        var span = document.createElement('span');
        span.innerText = 'Placeholder';
        div.appendChild(anchor);
        div.appendChild(span);
        anchor.innerText = "Special Link " + i + " - ";
        appContainer.appendChild(div);
        divList.push(div);
    }
    setInterval(function () {
        for (var i = 0; i < divList.length; i++) {
            var div = divList[i];
            div.style.marginLeft = Math.random() * 100 + 'px';
            div.children[1].innerText = div.children[0].offsetLeft + " px offsetLeft";
        }
    }, 5000);

}));
