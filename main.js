let gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

let moduleName = 'main.js';

let ioShutdown = new gpio(6,  'in', 'both'); // GPIO 02 = Entrada shutdown do sistema operacional.
let ioSensor   = new gpio(13, 'in', 'both'); // GPIO 03 = Entrada sensor.
let ioLight    = new gpio(19, 'out');        // GPIO 04 = Saída luzes.
let ioDoser    = new gpio(26, 'out');        // GPIO 05 = Saída dosador.

_log(moduleName, 'Start.');

//Apaga os leds
//ioShutdown.writeSync(0);
//ioSensor.writeSync(0);
ioLight.writeSync(0);
ioDoser.writeSync(0);

ioShutdown.watch(function (err, value) {
    if (err) { //if an error
        _log(moduleName, 'Port "SHUTDOWN" error: ' + err);
    }else{
        _log(moduleName, 'Port "SHUTDOWN" changed to "' + value + '"...');
        if (value = 1){
            _log(moduleName, 'Got a shutdown request...');
            cleanup();
        }
    }

});

ioSensor.watch(function (err, value) {
    if (err) { //if an error
        _log(moduleName, 'Port "SENSOR" error: ' + err);
    }else{
        _log(moduleName, 'Port "SENSOR" changed to "' + value + '"...');
        if (value = 1){



            _log(moduleName, '   1) Setting LIGHT to ON...');
            ioLight.writeSync(1);

            _log(moduleName, '   2) Aguarda 200 ms.');
            setTimeout(function (){
                _log(moduleName, '   3) Setting DOSER to ON...');
                ioDoser.writeSync(1);

                _log(moduleName, '   4) Aguarda 800 ms.');
                setTimeout(function (){

                    _log(moduleName, '   5) Setting DOSER to OFF.');
                    ioDoser.writeSync(0);

                    _log(moduleName, '   6) Aguarda 200 ms.');
                    setTimeout(function (){

                        _log(moduleName, '   7) Setting LIGHT to OFF.');
                        ioLight.writeSync(0);

                        _log(moduleName, '   8) Aguarda 5 segundos');
                        setTimeout(function (){

                            ioLight.writeSync(1);
                            setTimeout(function (){
                                ioLight.writeSync(0);
                                setTimeout(function (){
                                    ioLight.writeSync(1);
                                    setTimeout(function (){
                                        ioLight.writeSync(0);
                                        _log(moduleName, '   9) Done.');
                                    }, 250);
                                }, 250);
                            }, 250);

                        }, 5000);
                    }, 200);
                }, 800);
            }, 200);

            // _log(moduleName, '   1) Setting LIGHT to ON...');
            // await ioLight.writeSync(1);
            //
            // _log(moduleName, '   2) Aguarda 200 ms.');
            // await _sleep(200);
            //
            // _log(moduleName, '   3) Setting DOSER to ON...');
            // await ioDoser.writeSync(1);
            //
            // _log(moduleName, '   4) Aguarda 800 ms.');
            // await _sleep(800);
            //
            // _log(moduleName, '   5) Setting DOSER to OFF.');
            // await ioDoser.writeSync(0);
            //
            // _log(moduleName, '   6) Aguarda 200 ms.');
            // await _sleep(200);
            //
            // _log(moduleName, '   7) Setting LIGHT to OFF.');
            // await ioLight.writeSync(0);
            //
            // _log(moduleName, '   8) Aguarda 5 segundos');
            // await _sleep(5000);
            //
            // await ioLight.writeSync(1);
            // await _sleep(200);
            // await ioLight.writeSync(0);
            // await _sleep(200);
            // await ioLight.writeSync(1);
            // await _sleep(200);
            // await ioLight.writeSync(0);

        }
    }

});


function toggleLed(port, desc) {
    if (port.readSync() === 0) {
        _log(moduleName, 'Port "' + desc + '" was OFF. Turning it ON...');
        port.writeSync(1);
        return 1;
    } else {
        _log(moduleName, 'Port "' + desc + '" was ON. Turning it OFF...');
        port.writeSync(0);
        return 0;
    }
}

function cleanup() {

    _log(moduleName, 'Cleaning up...');

    //Apaga tudo
    //ioShutdown.writeSync(0);
    //ioSensor.writeSync(0);
    ioLight.writeSync(0);
    ioDoser.writeSync(0);

    //Libera
    ioShutdown.unexport();
    ioSensor.unexport();
    ioLight.unexport();
    ioDoser.unexport();

    _log(moduleName, 'Done.');
}

function _sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

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