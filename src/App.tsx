import {useEffect, useState} from 'react'
import axios, {type AxiosResponse} from 'axios';
import './App.css'
import type {Forecast, Period} from "./interfaces.ts";
import {ForecastTile} from "./ForecastTile.tsx";

function convertToForecast(period: Period): Forecast {
    return {
        name: period.name,
        windSpeed: period.windSpeed,
        temperature: period.temperature,
        units: period.temperatureUnit,
        description: period.shortForecast,
        isDaytime: period.isDaytime,
        id: period.number,
        start: new Date(period.startTime),
        end: new Date(period.endTime),
    };
}

function App() {
  const [location, setLocation] = useState<{latitude: number, longitude: number} | undefined>(undefined);
  const [hourlyUrl, setHourlyUrl] = useState();
  const [forecast, setForecast] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!navigator.geolocation) {
        console.error('Geolocation is not supported by your browser');
        return;
    }

    function errorHandler(error: GeolocationPositionError) {
        setErrorMessage(`Geolocation API error: ${error.message}`)
        console.error('Geolocation API error', error);
    }

    const successHandler = ({coords}: GeolocationPosition) => {
        const { latitude, longitude } = coords;
        setLocation({latitude, longitude});
    };

    // Options for high accuracy and timeout
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
  }, []);

  useEffect(() => {
      const {latitude, longitude} = location ?? {};
      if (latitude && longitude) {
          // const {latitude, longitude} = location;
          axios.get(`https://api.weather.gov/points/${latitude},${longitude}`, {
              params: {}
          }).then(({data}: AxiosResponse) => {
              setHourlyUrl(data.properties.forecast);
          })
              .catch(error => console.error('Error fetching data:', error));
      }
  }, [location]);

    useEffect(() => {
        if (hourlyUrl) {
            axios.get(hourlyUrl, {
                params: {}
            }).then(({data}: AxiosResponse) => {
                const forecastData = data.properties.periods.map(
                    (period: Period) => {
                        return convertToForecast(period);
                    }
                )
                setForecast(forecastData);
            })
                .catch(error => console.error('Error fetching data:', error));
        }
    }, [hourlyUrl]);

  return errorMessage ? <p>{errorMessage}</p> : (<>
    <h1 className="page-header">7-day Forecast</h1>
    <article className="forecast-list">
        {forecast.map((f: Forecast, idx: number)  => (
            <section className={f.isDaytime ? "forecast forecast-day" : "forecast forecast-night"} key={f.id}>
                <ForecastTile first={idx === 0} forecast={f} />
            </section>
        ))}
    </article>
  </>)
}

export default App
