let gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

let moduleName = 'main.js';

let ioShutdown = new gpio(2, 'out');    // GPIO 02 = Entrada shutdown do sistema operacional.
let ioSensor   = new gpio(3, 'out');    // GPIO 03 = Entrada sensor.
let iolight    = new gpio(4, 'out');    // GPIO 04 = Saída luzes.
let ioDoser    = new gpio(5, 'out');    // GPIO 05 = Saída dosador.

_log(moduleName, 'Start.');

//Ascende os leds
ioShutdown.writeSync(1);
ioSensor.writeSync(1);
iolight.writeSync(1);
ioDoser.writeSync(1);

// let interval = setInterval(tick, 1000);  // run the blinkLED function every 250ms
//
// function tick(){
//
//     _log(moduleName, 'tick');
//
//     toggleLed(ioShutdown, 'SHUTDOWN');
//     toggleLed(ioSensor, 'SENSOR');
//     toggleLed(iolight, 'LUZES');
//     toggleLed(ioDoser, 'DOSADOR');
//
// }
//
// function toggleLed(port, desc) {
//     if (port.readSync() === 0) {
//         _log(moduleName, 'Port "' + desc + '" was OFF. Turning it ON...');
//         port.writeSync(1);
//         return 1;
//     } else {
//         _log(moduleName, 'Port "' + desc + '" was ON. Turning it OFF...');
//         port.writeSync(0);
//         return 0;
//     }
// }
//
function cleanup() {

    _log(moduleName, 'Cleaning up...');

    //Para os dispartos do intervalo
    //clearInterval(interval);

    //Apaga os leds
    //ioShutdown.writeSync(0);
    //ioSensor.writeSync(0);
    //iolight.writeSync(0);
    //ioDoser.writeSync(0);

    //Libera
    ioShutdown.unexport();
    ioSensor.unexport();
    iolight.unexport();
    ioDoser.unexport();

    _log(moduleName, 'Done.');
}

setTimeout(cleanup, 10000);


function _log (module, data){

    let time = new Date().toISOString().split('T')[1];

    /*eslint-disable*/
    console.log(
        (time + Array(12).fill(' ').join('') ).slice(0, 12) + ' | ' +
        (module + Array(12).fill(' ').join('') ).slice(0, 12) + ' | ' +
        data
    );
    /*eslint-enable*/
}