(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
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
    var DEFAULT_INTERVAL_MS = 1500;
    var DEFAULT_ALERT_TYPE = EAlertType.ALERT;
    var DEFAULT_ALERT_FREQUENCY_MS = 10 * 60000; // 10 Minutes
    var DEFAULT_CONFIG = {
        maxAllowed: DEFAULT_MAX_ALLOWED,
        intervalMs: DEFAULT_INTERVAL_MS,
        alertType: DEFAULT_ALERT_TYPE,
        alertFrequencyMs: DEFAULT_ALERT_FREQUENCY_MS
    };
    var EventsQueue = /** @class */ (function () {
        function EventsQueue(config) {
            this.queue = [];
            this.maxAllowed = DEFAULT_MAX_ALLOWED;
            this.intervalMs = DEFAULT_INTERVAL_MS;
            this.alertType = EAlertType.ALERT;
            this.alertFrequencyMs = DEFAULT_ALERT_FREQUENCY_MS;
            this.lastAlertedTime = null;
            this.setConfig(config);
        }
        EventsQueue.getInstance = function () {
            if (!EventsQueue._instance_) {
                EventsQueue._instance_ = new EventsQueue();
            }
            return EventsQueue._instance_;
        };
        EventsQueue.prototype.setConfig = function (config) {
            config = config || {};
            var mergedConfig = __assign(__assign({}, DEFAULT_CONFIG), config);
            this.interval = null;
            this.queue = [];
            this.maxAllowed = mergedConfig.maxAllowed;
            this.intervalMs = mergedConfig.intervalMs;
            this.alertType = mergedConfig.alertType;
            this.alertFrequencyMs = mergedConfig.alertFrequencyMs;
        };
        EventsQueue.prototype.addEvent = function (event) {
            this.queue.push(event);
        };
        EventsQueue.prototype.startInterval = function () {
            var _this = this;
            if (this.interval) {
                window.console.warn('Events queue interval already started, ignoring..');
                return;
            }
            this.lastAlertedTime = null;
            this.interval = setInterval(function () {
                if (_this.shouldAlert()) {
                    _this.alertDeveloper();
                }
                // Reset the events queue
                _this.queue.length = 0;
            }, this.intervalMs);
        };
        EventsQueue.prototype.stopInterval = function () {
            clearInterval(this.interval);
            this.interval = null;
        };
        EventsQueue.prototype.shouldAlert = function () {
            // debugger;
            return this.queue.length > this.maxAllowed &&
                (!this.lastAlertedTime ||
                    new Date(this.lastAlertedTime.getTime() + this.alertFrequencyMs) < new Date());
        };
        EventsQueue.prototype.alertDeveloper = function () {
            if (this.alertType === EAlertType.ALERT) {
                window.alert(this.generateAlertMessage());
            }
            window.console.error(this.queue.slice());
            this.lastAlertedTime = new Date();
        };
        EventsQueue.prototype.generateAlertMessage = function () {
            return "Reflow detector triggered\n\n\n            Saw " + this.queue.length + " event(s) within " + this.intervalMs + " ms.\n \n            Please see console for more details.";
        };
        return EventsQueue;
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

    var buffer = EventsQueue.getInstance();
    // Reference link: https://gist.github.com/paulirish/5d52fb081b3570c81e3a
    var HTMLELEMENT_PROPERTIES = [
        // Box metrics
        'offsetLeft',
        'offsetTop',
        'offsetWidth',
        'offsetHeight',
        'offsetParent'
    ];
    var ELEMENT_PROPERTIES = [
        'scrollWidth',
        'scrollHeight',
        'scrollLeft',
        'scrollTop'
    ];
    var ELEMENT_METHODS = [
        'getClientRects',
        'getBoundingClientRect',
        'scrollBy',
        'scrollTo',
        'scrollIntoView',
        'scrollIntoViewIfNeeded'
    ];
    var WINDOW_PROPERTIES = [
        'scrollX',
        'scrollY',
        'innerHeight',
        'innerWidth'
    ];
    var WINDOW_METHODS = [
    // 'getComputedStyle',
    // 'getMatchedCSSRules'
    ];
    function elementWrapper() {
        for (var _i = 0, HTMLELEMENT_PROPERTIES_1 = HTMLELEMENT_PROPERTIES; _i < HTMLELEMENT_PROPERTIES_1.length; _i++) {
            var property = HTMLELEMENT_PROPERTIES_1[_i];
            defineObjectProperty(HTMLElement.prototype, property);
        }
        for (var _a = 0, ELEMENT_PROPERTIES_1 = ELEMENT_PROPERTIES; _a < ELEMENT_PROPERTIES_1.length; _a++) {
            var property = ELEMENT_PROPERTIES_1[_a];
            defineObjectProperty(Element.prototype, property);
        }
        for (var _b = 0, ELEMENT_METHODS_1 = ELEMENT_METHODS; _b < ELEMENT_METHODS_1.length; _b++) {
            var method = ELEMENT_METHODS_1[_b];
            defineObjectMethod(Element.prototype, method);
        }
        for (var _c = 0, WINDOW_PROPERTIES_1 = WINDOW_PROPERTIES; _c < WINDOW_PROPERTIES_1.length; _c++) {
            var property = WINDOW_PROPERTIES_1[_c];
            defineObjectProperty(window, property);
        }
        for (var _d = 0, WINDOW_METHODS_1 = WINDOW_METHODS; _d < WINDOW_METHODS_1.length; _d++) {
            var method = WINDOW_METHODS_1[_d];
            defineObjectMethod(window, method);
        }
    }
    function undoElementWrapper() {
        for (var _i = 0, HTMLELEMENT_PROPERTIES_2 = HTMLELEMENT_PROPERTIES; _i < HTMLELEMENT_PROPERTIES_2.length; _i++) {
            var property = HTMLELEMENT_PROPERTIES_2[_i];
            undoDefineObjectProperty(HTMLElement.prototype, property);
        }
        for (var _a = 0, ELEMENT_PROPERTIES_2 = ELEMENT_PROPERTIES; _a < ELEMENT_PROPERTIES_2.length; _a++) {
            var property = ELEMENT_PROPERTIES_2[_a];
            undoDefineObjectProperty(Element.prototype, property);
        }
        for (var _b = 0, ELEMENT_METHODS_2 = ELEMENT_METHODS; _b < ELEMENT_METHODS_2.length; _b++) {
            var method = ELEMENT_METHODS_2[_b];
            undoDefineObjectMethod(Element.prototype, method);
        }
        for (var _c = 0, WINDOW_PROPERTIES_2 = WINDOW_PROPERTIES; _c < WINDOW_PROPERTIES_2.length; _c++) {
            var property = WINDOW_PROPERTIES_2[_c];
            undoDefineObjectProperty(window, property);
        }
        for (var _d = 0, WINDOW_METHODS_2 = WINDOW_METHODS; _d < WINDOW_METHODS_2.length; _d++) {
            var method = WINDOW_METHODS_2[_d];
            undoDefineObjectMethod(window, method);
        }
    }
    function defineObjectProperty(objectPrototype, property) {
        var renamedPropertyName = getRenamedProperty(property);
        var originalImplementation = Object.getOwnPropertyDescriptor(objectPrototype, property);
        if (!originalImplementation) {
            console.warn("Invalid " + objectPrototype.toString() + " property passed in: " + property + " - could be a browser thing.");
            return;
        }
        Object.defineProperty(objectPrototype, renamedPropertyName, originalImplementation);
        Object.defineProperty(objectPrototype, property, {
            set: function (value) {
                var stacktrace = (new Error()).stack;
                buffer.addEvent({
                    type: property,
                    stacktrace: stacktrace
                });
                return this[renamedPropertyName] = value;
            },
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
    function defineObjectMethod(objectPrototype, method) {
        var renamedMethod = getRenamedProperty(method);
        var originalImplementation = objectPrototype[method];
        if (!originalImplementation) {
            console.warn("Invalid " + objectPrototype.toString() + " method passed in: " + method + " - could be a browser thing.");
            return;
        }
        objectPrototype[renamedMethod] = originalImplementation;
        objectPrototype[method] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var stacktrace = (new Error()).stack;
            buffer.addEvent({
                type: method,
                stacktrace: stacktrace
            });
            return objectPrototype[renamedMethod].apply(this, args);
        };
    }
    function undoDefineObjectProperty(objectPrototype, property) {
        var renamedPropertyName = getRenamedProperty(property);
        var originalImplementation = Object.getOwnPropertyDescriptor(objectPrototype, renamedPropertyName);
        if (!originalImplementation) {
            console.warn("Invalid " + objectPrototype.toString() + " property passed in: " + property + ", could not UNDO it - could be a browser thing.");
            return;
        }
        Object.defineProperty(objectPrototype, property, originalImplementation);
        delete objectPrototype[renamedPropertyName];
    }
    function undoDefineObjectMethod(objectPrototype, method) {
        var renamedMethod = getRenamedProperty(method);
        var originalImplementation = objectPrototype[renamedMethod];
        if (!originalImplementation) {
            console.warn("Invalid " + objectPrototype.toString() + " method passed in: " + method + ", could not UNDO it - could be a browser thing.");
            return;
        }
        objectPrototype[method] = originalImplementation;
        delete objectPrototype[renamedMethod];
    }

    var initialized = false;
    var ReflowRejector = /** @class */ (function () {
        function ReflowRejector() {
        }
        ReflowRejector.initialize = function (config) {
            if (initialized) {
                window.console.warn('ReflowRejector has already been initialized, ignoring..');
                return;
            }
            var buffer = EventsQueue.getInstance();
            buffer.setConfig(config);
            elementWrapper();
            buffer.startInterval();
            initialized = true;
        };
        ReflowRejector.teardown = function () {
            var buffer = EventsQueue.getInstance();
            undoElementWrapper();
            buffer.stopInterval();
            initialized = false;
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
        appContainer === null || appContainer === void 0 ? void 0 : appContainer.appendChild(div);
        divList.push(div);
    }
    setInterval(function () {
        for (var i = 0; i < divList.length; i++) {
            var div = divList[i];
            div.style.marginLeft = Math.random() * 100 + 'px';
            div.children[1].innerText = div.children[0].offsetLeft + " px offsetLeft";
        }
    }, 10000);

}));
