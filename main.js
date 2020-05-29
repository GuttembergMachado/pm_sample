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

let processingShutdown = false;
let processingSensor = false;

_log(moduleName, '   Listening for shutdown events...');
ioShutdown.watch(function (err, value) {

    if (err) { //if an error
        _log(moduleName, '   Port "SHUTDOWN" error: ' + err);
    }else{
        _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '" (' + ioShutdown.readSync() + ')...');

        if (processingShutdown === true){
            _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '" (' + ioShutdown.readSync() + '). Ignoring it...');
            return;
        }else {
            _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '" (' + ioShutdown.readSync() + '). Locking...');
            processingShutdown = true;

            _log(moduleName, '   Cleaning up...');

            //Desliga os leds
            ioLight.writeSync(0);
            ioDoser.writeSync(0);

            _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '" (' + ioShutdown.readSync() + '). Unlocking...');
            processingSensor = false;

            //Libera
            ioShutdown.unexport();
            ioSensor.unexport();
            ioLight.unexport();
            ioDoser.unexport();

            _log(moduleName, 'Done.');

        }
    }

});

_log(moduleName, '   Listening for sensor events...');
ioSensor.watch(function (err, value) {

    if (err) {
        _log(moduleName, '   Port "SENSOR" error: ' + err);
    }else {
        _log(moduleName, '   Port "SENSOR" changed to "' + value + '" (' + ioSensor.readSync() + ')...');

        if (processingSensor === true){
            _log(moduleName, '   Port "SENSOR" changed to "' + value + '" (' + ioSensor.readSync() + '). Ignoring...');
            return;
        }else {
            _log(moduleName, '   Port "SENSOR" changed to "' + value + '" (' + ioSensor.readSync() + '). Locking...');
            processingSensor = true;

            _log(moduleName, '      1) Setting LIGHT to ON...');
            ioLight.writeSync(1);

            _log(moduleName, '      2) Aguarda 200 ms.');
            setTimeout(function (){
                _log(moduleName, '      3) Setting DOSER to ON...');
                ioDoser.writeSync(1);

                _log(moduleName, '      4) Aguarda 800 ms.');
                setTimeout(function (){

                    _log(moduleName, '      5) Setting DOSER to OFF.');
                    ioDoser.writeSync(0);

                    _log(moduleName, '      6) Aguarda 200 ms.');
                    setTimeout(function (){

                        _log(moduleName, '      7) Setting LIGHT to OFF.');
                        ioLight.writeSync(0);

                        _log(moduleName, '      8) Aguarda 5 segundos');
                        setTimeout(function (){
                            _log(moduleName, '      Port "SENSOR" unlocking...');
                            processingSensor = false;
                        }, 5000);
                    }, 200);
                }, 800);
            }, 200);
        }

    }


});

function testLight(port, name){

    _log(moduleName, '   Testing ' + name + '...');
    port.writeSync(1);
    setTimeout(function (){
        port.writeSync(0);
        setTimeout(function (){
            port.writeSync(1);
            setTimeout(function (){
                port.writeSync(0);
                setTimeout(function (){
                    port.writeSync(1);
                    setTimeout(function (){
                        port.writeSync(0);
                        setTimeout(function (){
                            port.writeSync(1);
                            setTimeout(function (){
                                port.writeSync(0);
                                setTimeout(function (){
                                    _log(moduleName, '   ' + name + ' was tested.');
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);

}

testLight(ioLight, 'LIGHT');
testLight(ioDoser, 'DOSADOR') ;

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