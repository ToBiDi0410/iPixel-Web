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

export async function ledOn() {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x07, 0x01, 0x01]));
}
export async function ledOff() {
    await sendCommand(new Uint8Array([0x05, 0x00, 0x07, 0x01, 0x00]));
}
export async function setClockMode(style, dayOfWeek, year, month, day, showDate, format24) {
    await sendCommand(new Uint8Array([0x0B, 0x00, 0x06, 0x01, style, dayOfWeek, year, month, day, showDate ? 1 : 0, format24 ? 1 : 0]));
}
export async function setTime(hour, minute, second) {
    await sendCommand(new Uint8Array([0x08, 0x00, 0x01, 0x80, hour, minute, second, 0x00]));
}