<script setup>
import { ref } from 'vue';
import { AppState, selectDevice, ledOff, ledOn, setTime, setClockMode, setOrientation, setBrightness, setFunMode, clear, deleteScreen, setRythmAnimationMode, setRythmLevelMode, sendText } from './AppState';

const setClockMode_style = ref(1);
const setClockMode_dayOfWeek = ref(new Date().getDay());
const setClockMode_year = ref(new Date().getFullYear() - 2000);
const setClockMode_month = ref(new Date().getMonth());
const setClockMode_day = ref(new Date().getDate());
const setClockMode_showDate = ref(1);
const setClockMode_format24 = ref(1);

const setOrientation_value = ref(0);
const setBrightness_value = ref(0);
const setSpeed_value = ref(0);
const deleteScreen_value = ref(0);

const setRythmAnimationMode_style = ref(0);
const setRythmAnimationMode_frame = ref(0);

const setRythmLevelMode_style = ref(1);
const setRythmLevelMode_level0 = ref(0);
const setRythmLevelMode_level1 = ref(0);
const setRythmLevelMode_level2 = ref(0);
const setRythmLevelMode_level3 = ref(0);
const setRythmLevelMode_level4 = ref(0);
const setRythmLevelMode_level5 = ref(15);
const setRythmLevelMode_level6 = ref(0);
const setRythmLevelMode_level7 = ref(0);
const setRythmLevelMode_level8 = ref(0);
const setRythmLevelMode_level9 = ref(0);
const setRythmLevelMode_level10 = ref(0);

const setText_text = ref("Hello");
const setText_rainbowMode = ref(0);
const setText_animation = ref(0);
const setText_saveSlot = ref(1);
const setText_speed = ref(80);
const setText_colorR = ref(255);
const setText_colorG = ref(255);
const setText_colorB = ref(255);
const setText_font = ref("default")
const setText_matrixHeight = ref(16);
const setText_fontSize = ref(0);
const setText_fontOffsetX = ref(0);
const setText_fontOffsetY = ref(0);

const setTime_hour = ref(0);
const setTime_minute = ref(0);
const setTime_second = ref(0);

</script>

<template>
    <div class="App">
        <h1>Connection</h1>
        <button @click="selectDevice()">Connect</button>
        <div>Connection: {{ AppState.connectState }} {{ AppState.connectDetails }}</div>
        <div>Negotiation: {{ AppState.negotiateState }} {{ AppState.negotiateDetails }}</div>

        <div v-if="AppState.negotiateState == 'READY'">
            <h1>Controls</h1>

            <!-- Power -->
            <h2>Power</h2>
            <div>
                <button @click="ledOn()">Led On</button>
            </div>
            <div>
                <button @click="ledOff()">Led Off</button>
            </div>

            <!-- Orientation -->
            <h2>Orientation</h2>
            <div>
                <input type="number" min="0" max="3" placeholder="Orientation" v-model="setOrientation_value" />
                <button @click="setOrientation(setOrientation_value)">Set Orientation</button>
            </div>

            <!-- Brightness -->
            <h2>Brightness</h2>
            <div>
                <input type="number" min="0" max="100" placeholder="Brightness" v-model="setBrightness_value" />
                <button @click="setBrightness(setBrightness_value)">Set Brightness</button>
            </div>

            <!-- Speed -->
            <h2>Speed</h2>
            <div>
                <input type="number" min="0" max="100" placeholder="Speed" v-model="setSpeed_value" />
                <button @click="setSpeed(setSpeed_value)">Set Speed</button>
            </div>

            <h2>Clock Mode</h2>
            <!-- Clock Mode -->
            <div>
                <input type="number" min="1" max="8" placeholder="Style" v-model="setClockMode_style" />
                <input type="number" min="1" max="7" placeholder="Day of Week" v-model="setClockMode_dayOfWeek" />
                <input type="number" min="0" max="99" placeholder="Year (2000+y)" v-model="setClockMode_year" />
                <input type="number" min="1" max="12" placeholder="Month" v-model="setClockMode_month" />
                <input type="number" min="1" max="31" placeholder="Day" v-model="setClockMode_day" />
                <input type="number" min="0" max="1" placeholder="Show Date?" v-model="setClockMode_showDate" />
                <input type="number" min="0" max="1" placeholder="Format 24 hours?" v-model="setClockMode_format24" />
                <button @click="setClockMode(setClockMode_style, setClockMode_dayOfWeek, setClockMode_year, setClockMode_month, setClockMode_day, setClockMode_showDate, setClockMode_showDate)" v-if="AppState.negotiateState == 'READY'">Set Clock Mode</button>
            </div>

            <!-- Clock Time -->
            <div>
                <input type="number" min="0" max="23" placeholder="Hour" v-model="setTime_hour" />
                <input type="number" min="0" max="59" placeholder="Minute" v-model="setTime_minute" />
                <input type="number" min="0" max="59" placeholder="Second" v-model="setTime_second" />
                <button @click="setTime(setTime_hour, setTime_minute, setTime_second)">Set Time</button>
            </div>

            <!-- Fun Mode -->
            <h2>Fun Mode</h2>
            <div>
                <button @click="setFunMode(true)">Fun Mode On</button>
            </div>
            <div>
                <button @click="setFunMode(false)">Fun Mode Off</button>
            </div>

            <!-- Rythm Mode -->
            <h2>Rythm Mode</h2>
            <div>
                <input type="number" min="0" max="1" placeholder="Style" v-model="setRythmAnimationMode_style" />
                <input type="number" min="0" max="7" placeholder="Frame" v-model="setRythmAnimationMode_frame" />
                <button @click="setRythmAnimationMode(setRythmAnimationMode_style, ++setRythmAnimationMode_frame)">+ Frame</button>
                <button @click="setRythmAnimationMode(setRythmAnimationMode_style, --setRythmAnimationMode_frame)">- Frame</button>
                <button @click="setRythmAnimationMode(setRythmAnimationMode_style, setRythmAnimationMode_frame)">Set Level Rythm Animation</button>
            </div>

            <div>
                <input type="number" min="1" max="4" placeholder="Style" v-model="setRythmLevelMode_style" />
                <input type="number" min="0" max="15" placeholder="Level 0" v-model="setRythmLevelMode_level0" />
                <input type="number" min="0" max="15" placeholder="Level 1" v-model="setRythmLevelMode_level1" />
                <input type="number" min="0" max="15" placeholder="Level 2" v-model="setRythmLevelMode_level2" />
                <input type="number" min="0" max="15" placeholder="Level 3" v-model="setRythmLevelMode_level3" />
                <input type="number" min="0" max="15" placeholder="Level 4" v-model="setRythmLevelMode_level4" />
                <input type="number" min="0" max="15" placeholder="Level 5" v-model="setRythmLevelMode_level5" />
                <input type="number" min="0" max="15" placeholder="Level 6" v-model="setRythmLevelMode_level6" />
                <input type="number" min="0" max="15" placeholder="Level 7" v-model="setRythmLevelMode_level7" />
                <input type="number" min="0" max="15" placeholder="Level 8" v-model="setRythmLevelMode_level8" />
                <input type="number" min="0" max="15" placeholder="Level 9" v-model="setRythmLevelMode_level9" />
                <input type="number" min="0" max="15" placeholder="Level 10" v-model="setRythmLevelMode_level10" />
                <button @click="setRythmLevelMode(setRythmLevelMode_style, [setRythmLevelMode_level0, setRythmLevelMode_level1, setRythmLevelMode_level2, setRythmLevelMode_level3, setRythmLevelMode_level4, setRythmLevelMode_level5, setRythmLevelMode_level6, setRythmLevelMode_level7, setRythmLevelMode_level8, setRythmLevelMode_level9, setRythmLevelMode_level10])">Set Rythm Levels</button>
            </div>

            <!-- Text -->
            <h2>Text (Broken)</h2>
            <div>
                <input type="text" minlength="0" maxlength="20" placeholder="Text" v-model="setText_text" />
                <input type="number" min="0" max="9" placeholder="Rainbow Mode" v-model="setText_rainbowMode" />
                <input type="number" min="0" max="7" placeholder="Animation" v-model="setText_animation" />
                <input type="number" min="0" max="10" placeholder="Slot" v-model="setText_saveSlot" />
                <input type="number" min="0" max="100" placeholder="Speed" v-model="setText_speed" />
                <input type="number" min="0" max="255" placeholder="Color R" v-model="setText_colorR" />
                <input type="number" min="0" max="255" placeholder="Color G" v-model="setText_colorG" />
                <input type="number" min="0" max="255" placeholder="Color B" v-model="setText_colorB" />
                <input type="text" placeholder="Font" v-model="setText_font" />
                <input type="number" min="1" max="128" placeholder="Matrix Height" v-model="setText_matrixHeight" />
                <input type="number" min="0" max="255" placeholder="Font Size" v-model="setText_fontSize" />
                <input type="number" min="0" max="255" placeholder="Font Offset X" v-model="setText_fontOffsetX" />
                <input type="number" min="0" max="255" placeholder="Font Offset Y" v-model="setText_fontOffsetY" />
                <button @click="sendText(setText_text, setText_rainbowMode, setText_animation, setText_saveSlot, setText_speed, setText_colorR, setText_colorG, setText_colorB, setTExt_font, setText_matrixHeight, setText_fontSize, setText_fontOffsetX, setText_fontOffsetY)">Set Text</button>
                <p>text, rainbowMode, animation, saveSlot, speed,r ,g ,b, font, matrixHeight, fontSize, fontOffsetX, fontOffsetY</p>

            </div>

            <!-- EEPROM -->
            <h2>EEPROM</h2>
            <div>
                <input type="number" min="0" max="10" placeholder="Screen" v-model="deleteScreen_value" />
                <button @click="deleteScreen(deleteScreen_value)">Delete Screen</button>
            </div>
            <div>
                <button @click="clear()">Clear EEPROM</button>
            </div>
        </div>        
    </div>
</template>