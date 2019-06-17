(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    var EAlertType;
    (function (EAlertType) {
        EAlertType["ALERT"] = "ALERT";
        EAlertType["CONSOLE"] = "CONSOLE";
    })(EAlertType || (EAlertType = {}));
    var DEFAULT_MAX_ALLOWED = 10;
    var DEFAULT_BUFFER_MS = 500;
    var DEFAULT_ALERT_TYPE = EAlertType.ALERT;
    var Buffer = /** @class */ (function () {
        function Buffer(maxAllowed, bufferMs, alertType) {
            if (maxAllowed === void 0) { maxAllowed = DEFAULT_MAX_ALLOWED; }
            if (bufferMs === void 0) { bufferMs = DEFAULT_BUFFER_MS; }
            if (alertType === void 0) { alertType = DEFAULT_ALERT_TYPE; }
            this.interval = null;
            this.eventsQueue = [];
            this.maxAllowed = maxAllowed;
            this.bufferMs = bufferMs;
            this.alertType = alertType;
        }
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
            return "Reflow detector triggered\n\n            Saw " + this.eventsQueue.length + " event(s) within " + this.bufferMs + " ms.\n \n            Please see console for more details.";
        };
        return Buffer;
    }());

    var buffer = new Buffer();
    function elementWrapper(element) {
        defineObjectProperty(element, 'offsetLeft');
    }
    function defineObjectProperty(element, property) {
        var originalPropertyName = "_original_" + property + "_";
        element[originalPropertyName] = element[property];
        Object.defineProperty(element, property, {
            get: function () {
                var stacktrace = (new Error()).stack;
                buffer.addEvent({
                    type: property,
                    stacktrace: stacktrace
                });
                return element[originalPropertyName];
            }
        });
    }
    // function defineObjectMethod(element, property) {
    //     Object.defineProperty()
    // }

    var originalCreateElement = document.createElement;
    document.createElement = function (arg) {
        var otherArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            otherArgs[_i - 1] = arguments[_i];
        }
        var element = originalCreateElement.apply(void 0, [arg].concat(otherArgs));
        elementWrapper(element);
        return element;
    };

    var anchor = document.createElement('a');
    for (var i = 0; i < 500; i++) {
        anchor.offsetLeft;
    }

}));
