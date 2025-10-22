import { reactive, watch } from "vue";

export const SERVICE_UUID = "000000fa-0000-1000-8000-00805f9b34fb";
export const CHAR_UUID = "0000fa02-0000-1000-8000-00805f9b34fb";

export const AppState = reactive({
    device: null,
    connectState: "NONE",
    connectDetails: null,
    negotiateState: "NONE",
    negotiateDetails: null,
    service: null,
    characteristic: null,
});

export async function selectDevice() {
    console.log("User is selecting device...");
    AppState.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE_UUID]
    });
    AppState.device.addEventListener('gattserverdisconnected', async () => disconnected());
    console.log("User selected device", AppState.device);
    disconnected();
}

export async function connect() {
    if(AppState.connectState == "CONNECTED") return console.warn("Already connected!");
    console.log("Connecting...");
    AppState.connectState = "CONNECTING";
    AppState.connectDetails = null;
    try {
        await AppState.device.gatt.connect();
        connected();
    } catch(err) {
        console.error("Failed to connect:\n", err);
        AppState.connectState = "ERROR";
        AppState.connectDetails = "Failed to connect";
    }
}

export async function disconnected() {
    console.warn("Disconnected!");
    AppState.connectState = "DISCONNECTED";
    AppState.connectDetails = null;
    AppState.negotiateState = "WAITING";
    AppState.negotiateDetails = null;

    console.warn("Reconnecting...");
    await connect();
}

export async function connected() {
    console.log("Connected!");
    AppState.connectState = "CONNECTED";
    AppState.connectDetails = null;

    console.log("Getting service/characteristic...");
    AppState.negotiateState = "NEGOTIATING";
    AppState.negotiateDetails = null;
    try {
        AppState.service = await AppState.device.gatt.getPrimaryService('000000fa-0000-1000-8000-00805f9b34fb');
        console.log("Got service", AppState.service);
        AppState.characteristic = await AppState.service.getCharacteristic('0000fa02-0000-1000-8000-00805f9b34fb');
        console.log("Got characteristic", AppState.characteristic);
        AppState.negotiateState = "READY";
        AppState.negotiateDetails = null;
    } catch(err) {
        AppState.negotiateState = "ERROR";
        AppState.negotiateDetails = "Failed to get service/characteristic";
        console.error("Failed to get service/characteristic:\n", err);
    }
}

export async function sendCommand(bytes) {
    if(AppState.negotiateState != "READY") throw new Error("Device not ready");
    await AppState.characteristic.writeValue(bytes);
    console.log("Sent", bytes);
}


export async function setTime(hour, minute, second) {
    await sendCommand(new Uint8Array([0x08, 0x00, 0x01, 0x80, hour, minute, second, 0x00]));
}
export async function setFunMode(value) {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x04, 0x01, value ? 1 : 0]));
}
export async function setOrientation(orientation) {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x06, 0x80, orientation]));
}
export async function clear() {
    await sendCommand(new Uint8Array([0x04, 0x00, 0x03, 0x80]));
}
export async function setBrightness(brightness) {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x04, 0x80, brightness]));
}
export async function setSpeed(speed) {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x03, speed]));
}
export async function ledOff() {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x07, 0x01, 0x00]));
}
export async function ledOn() {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x07, 0x01, 0x01]));
}
export async function deleteScreen(screen) {
    await sendCommand(new Uint8Array([0x07, 0x00, 0x02, 0x01, 0x00, screen]));
}
export async function setPixel(x, y, r, g, b) {
    await sendCommand(new Uint8Array([0x0A, 0x00, 0x05, 0x01, 0x00, r, g, b, x, y]));
}
export async function setClockMode(style, dayOfWeek, year, month, day, showDate, format24) {
    await sendCommand(new Uint8Array([0x0B, 0x00, 0x06, 0x01, style, dayOfWeek, year, month, day, showDate ? 1 : 0, format24 ? 1 : 0]));
}
export async function setRythmLevelMode(style, levels) {
    await sendCommand(new Uint8Array([0x10, 0x00, 0x01, 0x02, style, ...levels.slice(0, 10)]));
}
export async function setRythmAnimationMode(style, frame) {
    await sendCommand(new Uint8Array([0x06, 0x00, 0x00, 0x02, frame, style]));
}
export async function sendText(text, rainbowMode, animation, saveSlot, speed,
                            r, g ,b, font, matrixHeight, fontSize,
                            fontOffsetX, fontOffsetY) {
    await sendCommand(generateTextBuffer(text, rainbowMode, animation, saveSlot, speed,
                            r, g, b, font, matrixHeight, fontSize,
                            fontOffsetX, fontOffsetY));
}

export function generateTextBuffer(text, rainbowMode, animation, saveSlot, speed,
                            r, g, b, font, matrixHeight, fontSize,
                            fontOffsetX, fontOffsetY) {
  // Convert to string, truncate text length to 120
  text = String(text || "");
  let tlen = Math.min(text.length, 120);

  const headerLen = 14;
  let packetLen = headerLen + tlen;
  if (packetLen > 240) packetLen = 240;

  const buf = new Uint8Array(packetLen);

  buf[0] = 0xAA;
  buf[1] = 0x02;
  buf[2] = tlen & 0xFF;
  buf[3] = rainbowMode & 0xFF;
  buf[4] = animation & 0xFF;
  buf[5] = saveSlot & 0xFF;
  buf[6] = speed & 0xFF;
  buf[7] = r & 0xFF;
  buf[8] = g & 0xFF;
  buf[9] = b & 0xFF;

  buf[10] = matrixHeight & 0xFF;
  buf[11] = fontSize & 0xFF;
  buf[12] = fontOffsetX & 0xFF;
  buf[13] = fontOffsetY & 0xFF;

  // Copy text as ASCII
  for (let i = 0; i < tlen && headerLen + i < packetLen; i++) {
    buf[headerLen + i] = text.charCodeAt(i) & 0xFF;
  }

  return buf;
}
