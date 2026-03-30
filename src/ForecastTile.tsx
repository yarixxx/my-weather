import type {Forecast} from "./interfaces.ts";

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US').format(date)
}

export function ForecastTile({forecast, first}: {forecast: Forecast, first: boolean}) {
    return <details className="forecast-content" open={first}>
        <summary className="forecast-title">{forecast.name}</summary>
        <div className="forecast-interval">
            <time>{formatTime(forecast.start)}</time>
        </div>
        <div>{forecast.description}</div>
        <div>Temperature: ({forecast.temperature} {forecast.units})</div>
    </details>
}