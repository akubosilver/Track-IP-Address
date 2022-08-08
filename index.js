const inputIP = document.querySelector('[data-input]')
const ipAddress = document.querySelector('[data-ipAddress]')
const iplocation = document.querySelector('[data-location]')
const timeZone = document.querySelector('[data-timezone]')
const internetServiceProvider = document.querySelector('[data-isp]')
const submitBtn = document.querySelector('[data-submit]')
import {apiKey1, apiKey2} from './map.js'

let inputArr = []
const YOUR_API_KEY1 = apiKey1
const API_KEY2 = apiKey2
let latitude = 6.465422
let longitude = 3.406448

createMap(latitude, longitude)

inputIP.addEventListener('input', getInputValue)
submitBtn.addEventListener('click', getIpAddress)
document.addEventListener('keydown', (e) => {
    if(inputIP.value === '') return
    if(e.key === 'Enter')
    getIpAddress()
})

function getInputValue(e) {
    const inputtedIP = e.target.value
    inputArr.push(inputtedIP)
}

async function getIpAddress() {
    try {
        const enteredIPAddress = inputArr[inputArr.length - 1]
        const res = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${YOUR_API_KEY1}&ipAddress=${enteredIPAddress}`)
        const result = await res.json()
        ipAddress.innerText = result.ip
        iplocation.innerText = `${result.location.country} ${result.location.region}`
        timeZone.innerText = `UTC ${result.location.timezone}`
        internetServiceProvider.innerText = result.isp
        getLongLat(result.location.region)
    } catch(err) {
        alert('Sorry Your Request is not Working currently, Try Again Later')
        getLongLat("Lagos")
    }
    
    inputIP.value = ''
} 

async function getLongLat(cityName) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY2}`)
        const data = await res.json()
        const newlatitude = data.city.coord.lat
        const newlongitude = data.city.coord.lon
        createMap(newlatitude, newlongitude)
    } catch(err) {
        iplocation.innerText = "This IP address"
        timeZone.innerText = "is"
        internetServiceProvider.innerText = "Invalid"
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Lagos&appid=${API_KEY2}`)
        const data = await res.json()
        const newlatitude = data.city.coord.lat
        const newlongitude = data.city.coord.lon
        createMap(newlatitude, newlongitude)
    } 
}

function createMap(latitude, longitude) {
    document.getElementById('weathermap').innerHTML = "<div id='map' style='width:100%; height: 100%; z-index:1'></div>";

    const map = L.map('map').setView([latitude, longitude], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    L.circle([latitude, longitude], {radius: 600}).addTo(map)
    const marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup("<b>Hello Dear!</b><br>This is the IP Location.").openPopup();
}
