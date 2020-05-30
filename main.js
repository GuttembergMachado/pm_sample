let gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
let http = require('http').createServer(handleRequest);
let io   = require('socket.io')(http)

let moduleName = 'main.js';

let ioShutdown = new gpio(21, 'in', 'both', {debounceTimeout: 100});  // GPIO 02 = Entrada shutdown do sistema operacional.
let ioSensor   = new gpio(13, 'in', 'both', {debounceTimeout: 100});  // GPIO 03 = Entrada sensor.
let ioLight    = new gpio(19, 'out');                                 // GPIO 04 = Saída luzes.
let ioDoser    = new gpio(26, 'out');                                 // GPIO 05 = Saída dosador.

let processingShutdown = false;
let processingSensor = false;

let socketEmitter;

_log(moduleName, 'Starting...');

_log(moduleName, '   Listening for shutdown events...');
ioShutdown.watch(function (err, value) {

    if (err) { //if an error
        _log(moduleName, '   Port "SHUTDOWN" error: ' + err);
    }else{
        if (processingShutdown === true){
            _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '". Ignoring...');
            return;
        }else {
            _log(moduleName, '   Port "SHUTDOWN" changed to "' + value + '". Locking...');
            processingShutdown = true;

            _log(moduleName, '      1) Setting LIGHT to OFF...');
            ioLight.writeSync(0);

            _log(moduleName, '      2) Freeing LIGHT port...');
            ioLight.unexport();

            _log(moduleName, '      3) Setting DOSER to OFF...');
            ioDoser.writeSync(0);

            _log(moduleName, '      4) Freeing DOSER port...');
            ioDoser.unexport();

            _log(moduleName, '      5) Freeing SENSOR port...');
            ioSensor.unexport();

            _log(moduleName, '      6) Freeing SHUTDOWN port...');
            ioShutdown.unexport();

            _log(moduleName, '   Shutdown completed.');
            processingShutdown = false;

            _log(moduleName, 'Done.');
            //process.exit();
        }
    }

});

_log(moduleName, '   Listening for sensor events...');
ioSensor.watch(function (err, value) {

    if (err) {
        _log(moduleName, '   Port "SENSOR" error: ' + err);
    }else {
        if (processingSensor === true){
            _log(moduleName, '   Port "SENSOR" changed to "' + value + '". Ignoring...');
            return;
        }else {
            _log(moduleName, '   Port "SENSOR" changed to "' + value + '". Locking...');
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

                    _log(moduleName, '      6) Aguarda 5 segundos ms.');
                    setTimeout(function (){

                        _log(moduleName, '      7) Setting LIGHT to OFF.');
                        ioLight.writeSync(0);

                        _log(moduleName, '      Port "SENSOR" unlocking...');
                        _log(moduleName, '   Waiting for interrupts...');
                        processingSensor = false;

                    }, 5000);
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

function handleRequest (req, res) {

    let data = '<!DOCTYPE html>\n' +
               '<html>\n' +
               '   <title>Paradise Mounting</title>\n' +
               '   <body>\n' +
               '      <input id="ctlShutdown" type="button">ioShutdown\n' +
               '      <input id="ctlSensor" type="button">ioSensor\n' +
               '      <input id="ctlLight" type="checkbox">ioLight\n' +
               '      <input id="ctlDoser" type="checkbox">ioDoser\n' +
               '   </body>\n' +
               '   <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.3/socket.io.js"></script>\n' +
               '   <script>\n' +
               '      var socket = io()\n' +
               '      window.addEventListener("load", function(){\n' +
               '          var ctlShutdown = document.getElementById("ctlShutdown");\n' +
               '          ctlShutdown.addEventListener("change", function(){\n' +
               '             socket.emit("Shutdown", Number(this.checked));\n' +
               '          });\n' +
               '          var ctlSensor = document.getElementById("ctlSensor");\n' +
               '          ctlSensor.addEventListener("change", function(){\n' +
               '             socket.emit("Sensor", Number(this.checked));\n' +
               '          });\n' +
               '          var ctlLight = document.getElementById("ctlLight");\n' +
               '          ctlLight.addEventListener("change", function(){\n' +
               '             socket.emit("Light", Number(this.checked));\n' +
               '          });\n' +
               '          var ctlDoser = document.getElementById("ctlDoser");\n' +
               '          ctlDoser.addEventListener("change", function(){\n' +
               '             socket.emit("Doser", Number(this.checked));\n' +
               '          });\n' +
               '      });\n' +
               '      socket.on("Shutdown", function (data) {\n' +
               '          document.getElementById("ctlShutdown").checked = data;\n' +
               '          socket.emit("Shutdown", data);\n' +
               '      });\n' +
               '      socket.on("Sensor", function (data) {\n' +
               '          document.getElementById("ctlSensor").checked = data;\n' +
               '          socket.emit("Sensor", data);\n' +
               '      });\n' +
               '      socket.on("Light", function (data) {\n' +
               '          document.getElementById("ctlLight").checked = data;\n' +
               '          socket.emit("Light", data);\n' +
               '      });\n' +
               '      socket.on("Doser", function (data) {\n' +
               '          document.getElementById("ctlDoser").checked = data;\n' +
               '          socket.emit("Doser", data);\n' +
               '      });\n' +
               '   </script>\n'
               '</html>'

    _log(moduleName, '   Serving HTML...');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
}

io.sockets.on('connection', function (socket) {

    socketEmitter = socket;

    socket.on('Shutdown', function(data) {
        _log(moduleName, '   Got a "Shutdown" message...');
    });

    socket.on('Sensor', function(data) {
        _log(moduleName, '   Got a "Sensor" message...');
    });

    socket.on('Light', function(data) {
        _log(moduleName, '   Got a "Light" message...');
        if (data != ioLight.readSync() ){
            ioLight.writeSync(data);
        }
    });

    socket.on('Doser', function(data) {
        _log(moduleName, '   Got a "Doser" message...');
        if (data != ioDoser.readSync()){
            ioDoser.writeSync(data);
        }
    });

});

_main();

function _main(){

    testLight(ioLight, 'LIGHT');
    testLight(ioDoser, 'DOSADOR') ;

    _log(moduleName, '   Creating HTTP server...');
    http.listen(8080);

    _log(moduleName, '   Waiting for interrupts...');

}

// function _sleep(ms) {
//     return new Promise((resolve) => {
//         setTimeout(resolve, ms);
//     });
// }

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