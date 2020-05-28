let gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var led = new gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

let ioShutdown = new gpio(2, 'out');     / GPIO 02 = Entrada shutdown do sistema operacional.
let ioSensor   = new gpio(3, 'out');    // GPIO 03 = Entrada sensor.
let iolight    = new gpio(4, 'out');    // GPIO 04 = Saída luzes.
let ioDoser    = new gpio(5, 'out');    // GPIO 05 = Saída dosador.

let interval = setInterval(tick, 250);  // run the blinkLED function every 250ms

function tick(){

    toggleLed(ioShutdown);
    toggleLed(ioSensor);
    toggleLed(iolight);
    toggleLed(ioDoser);

}

function toggleLed(port) {
    if (port.readSync() === 0) {
        port.writeSync(1);
        return 1;
    } else {
        port.writeSync(0);
        return 0;
    }
}

function cleanup() {

    //Para os dispartos do intervalo
    clearInterval(interval);

    //Apaga os leds
    ioShutdown.writeSync(0);
    ioSensor.writeSync(0);
    iolight.writeSync(0);
    ioDoser.writeSync(0);

    //Libera
    ioShutdown.unexport();
    ioSensor.unexport();
    iolight.unexport();
    ioDoser.unexport();
}

setTimeout(cleanup, 10000);
