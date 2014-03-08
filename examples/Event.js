/**
 *
 * EventEmitter Example
 *
 **/

// EventEmitter has been included

// For clean logging
var log = function () {
    console.log('----------------------');
    for (var argument in arguments) {
        if (arguments.hasOwnProperty(argument)) {
            console.log(arguments[argument]);
        }
    }
};

var Event = new EventEmitter();


/*
 *  Fire an event once
 *  @param {string} event
 *  @param {function} listener
 */
Event.on("something awesome", function (something, anotherStuff, boring) {
    log("AWESOME !", something, anotherStuff, boring);
});


/*
 * Fire some event
 * @param {string} Event Name
 * @param Some data
 */
Event.emit("something awesome", "AWESOME STUFF !", "ANOTHER AWESOME !", "... BORING !");


/*
 *  Fire when a new listener has been created
 *  @param {string} event
 *  @param {function} listener
 */
Event.on("newListener", function (event, listener) {
    // Do something
});


/*
 *  Listening an event only one time
 *  @param {string} event
 *  @param {function} listener
 */
Event.once("only one time", function (stuff) {
    log("Only One Time !", stuff);
});

// Will fire
Event.emit("only one time", "First Time !");
// Will not fire
Event.emit("only one time", "Second Time !");


// According to the NodeJS EventEmitter API, a warning will fire !
for (var i = 0; i < 20; i++) {
    Event.on("Too many Event !", function () {});
};


/*
 *  Change max listeners for one event (0 = unlimited)
 *  @param {number}
 */
Event.setMaxListeners(20);
// But not this time !
for (var i = 0; i < 20; i++) {
    Event.on("Not this time !", function () {
        log("This will not be logged");
    });
};


// More information at http://nodejs.org/api/events.html