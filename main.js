var gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var led = new gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
var interval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
    if (led.readSync() === 0) { //check the pin state, if the state is 0 (or off)
        led.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        led.writeSync(0); //set pin state to 0 (turn LED off)
    }
}

function endBlink() { //function to stop blinking
    clearInterval(interval); // Stop blink intervals
    led.writeSync(0); // Turn LED off
    led.unexport(); // Unexport GPIO to free resources
}

setTimeout(endBlink, 5000); //stop blinking after 5 seconds