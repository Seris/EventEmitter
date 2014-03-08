/*
 * How to implement EventEmitter in your object
 */

// EventEmitter has been included

var AwesomeTimer = function () {
    var self = this;

    self.seconds = 0;

    setInterval(function () {
        self.seconds++;
        self.emit("second added", self.seconds);
    }, 1000);
};

// Implement EventEmitter to the AwesomeTimer =D
AwesomeTimer.prototype.__proto__ = EventEmitter.prototype;

var Timer = new AwesomeTimer();
Timer.on("second added", function (seconds) {
    console.log(seconds);
});