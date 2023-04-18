const pixelNum = 10;
let hostNameInput, portNumberInput, portSelect, updateSerialConnectionButton;
let serial;

/**
 * シリアル通信用の共通UIを構築する
 */
function initUi() {
  hostNameInput = createInput(location.hostname);
  portNumberInput = createInput(8081, 'number');
  updateSerialConnectionButton = createButton('update serial connection');
  updateSerialConnectionButton.mouseClicked(updateSerialConnection);
  portSelect = createSelect();
  portSelect.id('serial-port');
  portSelect.changed(function () {
    serial.openPort(portSelect.selected());
  });
}

/**
 * シリアル通信のコネクションを更新する
 */
function updateSerialConnection() {
  if (serial && serial.isConnected()) {
    serial.closePort();
  }

  serial = new p5.SerialPort(hostNameInput.value(), portNumberInput.value());
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.list();
}

/**
 * p5.serialserverからポートのリストを受け取った際に実行される
 */
function gotList(portList) {
  for (let port of portList) {
    portSelect.option(port);
  }

  if (portList.length !== 0) {
    portSelect.selected(portList[0]);
    serial.openPort(portSelect.selected());
  }
}

/**
 * Arduinoからデータを受け取った際に実行される
 */
function gotData() {
  let currentString = serial.read();
  console.log(currentString);
}

/**
 * NeoPixelのピクセルを制御するための情報を送信する
 */
function sendPixelData(i, r, g, b, command = 1) {
  if (serial) {
    serial.write(parseInt(i));
    serial.write(parseInt(r));
    serial.write(parseInt(g));
    serial.write(parseInt(b));
    serial.write(parseInt(command));
    serial.write('\n');
  }
}
