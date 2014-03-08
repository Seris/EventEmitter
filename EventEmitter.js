/**
 * Event Emitter (Node.JS Implementation)
 * From Seris (@Serris_) seerriss@gmail.com
 * License : GNU GENERAL PUBLIC LICENSE, Version 3, 29 June 2007 (https://www.gnu.org/licenses/gpl-3.0.txt)
 **/

(function(){
    "use strict";

    var EventEmitter = function(){};

    EventEmitter.listenerCount = function(emitter, event){
        if(!arguments[0] instanceof EventEmitter){
            return 0;
        }

        if(emitter._events[arguments[1]]){
            return emitter._events[arguments[1]].length;
        } else {
            return 0;
        }
    };

    EventEmitter.prototype._maxListeners = 10;
    EventEmitter.prototype._events = {};

    // Bind event
    EventEmitter.prototype.on = function(event, listener){
        if(typeof arguments[1] !== "function"){
            throw new TypeError("listener must be a function");
        }

        var event = event.toString();

        if(!this._events[event]){
            this._events[event] = [];
            this._events[event].warned = false;
        }

        if(this._maxListeners !== 0 && this._events[event].length - 1 > this._maxListeners && !this._events[event].warned){
            console.warn(
                "possible EventEmitter memory leak detected. " +
                this._events[event].length +
                " listeners added. Use emitter.setMaxListeners() to increase limit."
            );
            this._events[event].warned = true;
        }

        this._events[event].push(listener);

        this.emit('newListener', event, listener);
    };

    EventEmitter.prototype.once = function(event, listener){
        if(typeof arguments[1] !== "function"){
            throw new TypeError("listener must be a function");
        }

        var event = event.toString();

        if(!this._events[event]){
            this._events[event] = [];
            this._events[event].warned = false;
        }

        if(this._maxListeners !== 0 && this._events[event].length - 1 > this._maxListeners && !this._events[event].warned){
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
    EventEmitter.prototype.emit = function(event, data){
        if(typeof event !== "string"){
            throw new TypeError("Expected string for event ! " + typeof event + " given !");
        }

        if(!this._events[event]){
            return;
        }

        delete arguments[0];
        for(var id in arguments){
            arguments[id - 1] = arguments[id];
            delete arguments[id];
        };

        for(var i = 0; i < this._events[event].length; i++){
            switch (typeof this._events[event][i]){
                case "function":
                    this._events[event][i].apply(this, arguments);
                    break;

                case "object":
                    this._events[event][i].listener.apply(this, arguments);
                    delete this._events[event][i];
                    break;
            }
        }

        for(var id in arguments){
            delete arguments[id];
        }
    };

    // Remove Event
    EventEmitter.prototype.removeListener = function(event, listener){
        if(typeof event !== "string"){
            throw new TypeError("Expected string for event ! " + typeof event + " given !");
        }

        if(typeof listener !== "function"){
            throw new TypeError("Listener must be a function !");
        }

        if(!this._events[event]){
            return false;
        }

        var index = this._events[event].indexOf(listener);
        if(index !== -1){
            this.emit('removeListener', event, listener);
            delete this._events[event][index];
            return true;
        } else {
            return false;
        }
    };

    // Remove (All) Events
    EventEmitter.prototype.removeAllListeners = function(event){
        if(arguments[0]){
            if(typeof event !== "string"){
                throw new TypeError("Expected string for event ! " + typeof event + " given !");
            }
            delete this._events[event];
        } else {
            this._events = {};
        }
    };

    // Set Max Listeners
    EventEmitter.prototype.setMaxListeners = function(max){
        if(typeof max !== "number"){
            throw new TypeError("Expected number for max listeners ! " + typeof event + " given !");
        }

        if(max < 0){
            throw new TypeError("Expected number greater or equal to 0 for max listeners ! " + max + " given !");
        }

        this._maxListeners = max;
    };

    this.EventEmitter = EventEmitter;

}).call(window);