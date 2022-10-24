import React from "react";
import { useState, useRef, useEffect } from "react";
import "./styles.css";

const myApiKey = "beaefa44099b851be631a8e01ca04ca8";
const myApiKey1 = "ecc70ed7808c46d5a738d67ff6c5e275";
async function requestData(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${myApiKey}`
  );
  const resp = await response.json();
  console.log(resp);
  return resp;
}
async function requestTime(lat, long) {
  const response = await fetch(
    `https://api.ipgeolocation.io/timezone?apiKey=${myApiKey1}&lat=${lat}&long=${long}`
  );
  const resp = await response.json();
  console.log(resp);
  return resp;
}
export default function App() {
  const [infos, updateInfo] = useState({
    name: "",
    country: "",
    humidity: "",
    temp: "",
    tempFeel: "",
    weather: "",
    windSpeed: "",
    errorMessage: "",
    dataLat: "",
    dataLon: "",
    clock: "",
  });

  const myRef = useRef("");
  function Clock({ time_zone }) {
    const [currentTime, setTime] = useState("");

    let options = {
        timeZone: time_zone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      },
      formatter = new Intl.DateTimeFormat([], options);

    function updateTime() {
      let time = formatter.format(new Date());

      setTime(time);
    }
    useEffect(() => {
      let myInterval = setInterval(updateTime, 500);
    });

    if (time_zone) {
      return <div>{currentTime}</div>;
    }
    return <></>;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      let city = myRef.current.value;
      const data = await requestData(city);

      console.log(data);
      console.log(city);

      if (!data.name || city === "") {
        updateInfo({
          name: "",
          country: "",
          humidity: "",
          temp: "",
          tempFeel: "",
          weather: "",
          windSpeed: "",
          dataLat: "",
          dataLon: "",
          clock: "",
        });

        throw data.cod;
      }
      const dataTime = await requestTime(data.coord.lat, data.coord.lon);

      updateInfo({
        name: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        temp: handleAmount(data.main.temp),
        tempFeel: data.main.feels_like,
        weather: data.weather[0].description,
        windSpeed: handleAmount(Number(data.wind.speed) * 3.6),
        errorMessage: "",
        clock: dataTime.timezone,
      });

      console.log(dataTime);
      console.log(dataTime.timezone);
    } catch (error) {
      if (error === "400") {
        updateInfo({
          errorMessage: `${error} Lütfen bir ifade giriniz`,
        });
      }
      if (error === "404") {
        updateInfo({
          errorMessage: `${error} Lütfen geçerli bir ifade giriniz`,
        });
      }
      console.log(error.message);
    }
  }

  const handleAmount = (value) => {
    const numberAmount = Number(value);
    const rounded = Math.round(numberAmount * 1e2) / 1e2;
    return rounded;
  };

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input className="input-search" type="text" ref={myRef} />
      </form>
      <div className="data main">
        <div>{infos.errorMessage}</div>
        <div className="left">

        {infos.humidity ? (
          <div className="humidity">
            Humidity <br />
            {infos.humidity}%
          </div>
        ) : null}
        </div>

        <div className="mid">
          <div className="location mid-text">
            {infos.name} {infos.country}
          </div>
          {infos.temp ? (
            <div className="temp mid-text">
              {infos.temp} °C <br />
            </div>
          ) : null}
          {infos.tempFeel ? (
            <div className="tempFeel mid-text"> Real feel {infos.tempFeel} °C</div>
          ) : null}
          <div className="weather mid-text ">{infos.weather}</div>
          {infos.windSpeed ? (
            <div className="wind mid-text">{infos.windSpeed} km/h</div>
          ) : null}
        </div>

        <div className="clock right">
          {infos.clock ? <Clock time_zone={infos.clock} /> : null}
        </div>
      </div>
    </>
  );
}
