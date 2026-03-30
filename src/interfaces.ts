
export interface Forecast {
    name: string,
    windSpeed: string,
    temperature: number,
    units: string,
    description: string,
    isDaytime: boolean,
    id: number,
    start: Date,
    end: Date,
}

export interface Period {
    name: string,
    windSpeed: string,
    temperature: number,
    temperatureUnit: string,
    shortForecast: string,
    number: number,
    isDaytime: boolean,
    startTime: string,
    endTime: string
}