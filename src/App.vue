<script setup>
import { ref } from 'vue';
import { AppState, selectDevice, ledOff, ledOn, setTime, setClockMode } from './AppState';

const setClockMode_style = ref(0);
const setClockMode_dayOfWeek = ref(new Date().getDay());
const setClockMode_year = ref(new Date().getFullYear() - 2000);
const setClockMode_month = ref(new Date().getMonth());
const setClockMode_day = ref(new Date().getDate());
const setClockMode_showDate = ref(1);
const setClockMode_format24 = ref(1);

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
            <h2>Power</h2>
            <button @click="ledOn()" v-if="AppState.negotiateState == 'READY'">Led On</button>
            <br>
            <button @click="ledOff()" v-if="AppState.negotiateState == 'READY'">Led Off</button>

            <h2>Clock</h2>
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
                <button @click="setTime(setTime_hour, setTime_minute, setTime_second)" v-if="AppState.negotiateState == 'READY'">Set Time</button>
            </div>

        </div>        
    </div>
</template>