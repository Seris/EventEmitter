/**
 * Event Emitter (Node.JS => Browser)
 * Created by Seris (Twitter: @Serris_) seerriss@gmail.com
 * License: GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007 (https://www.gnu.org/licenses/gpl-3.0.txt)
 * URL: https://github.com/Seris/EventEmitter
 **/

(function () {
    "use strict";

    var EventEmitter = function () {};

    EventEmitter.listenerCount = function (emitter, event) {
        if (!emitter instanceof EventEmitter) {
            return 0;
        }

        if (!arguments[1]) {
            return 0;
        }

        if (emitter._events[event]) {
            return emitter._events[event].length;
        } else {
            return 0;
        }
    };

    EventEmitter.prototype._maxListeners = 10;
    EventEmitter.prototype._events = {};

    // Bind event
    EventEmitter.prototype.on = function (event, listener) {
        if (typeof arguments[1] !== "function") {
            throw new TypeError("listener must be a function");
        }

        var event = event.toString();

        if (!this._events[event]) {
            this._events[event] = [];
            this._events[event].warned = false;
        }

        if (this._maxListeners !== 0 && this._events[event].length - 1 > this._maxListeners && !this._events[event].warned) {
            console.warn(
                "possible EventEmitter memory leak detected. " +
                (this._events[event].length - 1) +
                " listeners added. Use emitter.setMaxListeners() to increase limit."
            );
            this._events[event].warned = true;
        }

        this._events[event].push(listener);

        this.emit('newListener', event, listener);
    };

    EventEmitter.prototype.once = function (event, listener) {
        if (typeof arguments[1] !== "function") {
            throw new TypeError("listener must be a function");
        }

        var event = event.toString();

        if (!this._events[event]) {
            this._events[event] = [];
            this._events[event].warned = false;
        }

        if (this._maxListeners !== 0 && this._events[event].length - 1 > this._maxListeners && !this._events[event].warned) {
            console.warn(
                "possible EventEmitter memory leak detected. " +
                this._events[event].length +
                " listeners added. Use emitter.setMaxListeners() to increase limit."
            );
            this._events[event].warned = true;
        }

        this._events[event].push({
            listener: listener
        });

        this.emit('newListener', event, listener);
    };

    // Fire Event
    EventEmitter.prototype.emit = function () {
        if (typeof arguments[0] !== "string") {
            throw new TypeError("Expected string for event ! " + typeof arguments[0] + " given !");
        }

        var event = arguments[0];

        if (!this._events[event]) {
            return;
        }

        var args = new Array(arguments.length);
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }

        var self = this;

        for (var i = 0; i < this._events[event].length; i++) {
            switch (typeof this._events[event][i]) {
            case "function":
                (function (fn) {
                    setTimeout(function () {
                        fn.apply(this, args);
                    }, 0);
                }).call(this, this._events[event][i]);
                break;

            case "object":
                var fn = this._events[event].splice(i, 1)[0];
                (function (fn) {
                    setTimeout(function () {
                        fn.listener.apply(this, args);
                    }, 0);
                    i--;
                }).call(this, fn);
                break;
            }
        }
    };

    // Remove Event
    EventEmitter.prototype.removeListener = function (event, listener) {
        if (typeof event !== "string") {
            throw new TypeError("Expected string for event ! " + typeof event + " given !");
        }

        if (typeof listener !== "function") {
            throw new TypeError("Listener must be a function !");
        }

        if (!this._events[event]) {
            return false;
        }

        var index = this._events[event].indexOf(listener);
        if (index !== -1) {
            this.emit('removeListener', event, listener);
            this._events[event].splice(index, 1);
            return true;
        } else {
            return false;
        }
    };

    // Remove (All) Events
    EventEmitter.prototype.removeAllListeners = function (event) {
        if (arguments[0]) {
            if (typeof event !== "string") {
                throw new TypeError("Expected string for event ! " + typeof event + " given !");
            }
            delete this._events[event];
        } else {
            this._events = {};
        }
    };

    // Set Max Listeners
    EventEmitter.prototype.setMaxListeners = function (max) {
        if (typeof max !== "number") {
            throw new TypeError("Expected number for max listeners ! " + typeof event + " given !");
        }

        if (max < 0) {
            throw new TypeError("Expected number greater or equal to 0 for max listeners ! " + max + " given !");
        }

        this._maxListeners = max;
    };

    // Returns an array of listeners for the specified event
    EventEmitter.prototype.listeners = function (event) {
        if (!this._events[event]) {
            return [];
        }

        // Clone the array
        return this._events[event].slice(0);
    };

    this.EventEmitter = EventEmitter;

}).call(window);