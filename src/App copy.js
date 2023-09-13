import { useState, useEffect } from 'react'

import { IoMdSearch, IoIosGlobe } from 'react-icons/io'
import Cloud from './assets/images/cloud.svg'
import Cloudly from './assets/images/🦆 icon _day cloudy_.svg'
import Storm from './assets/images/🦆 icon _storm showers_.svg'

const API_KEY = 'dd0740444021425f85362340231209'

const content = [
    {
        id: 0,
        tab: '3 days',
        content: 'content 1',
    },
    {
        id: 1,
        tab: '7 days',
        content: 'content 2',
    },
    {
        id: 2,
        tab: '10 days',
        content: 'content 3',
    },
]

function App() {
    const [query, setQuery] = useState('Tashkent')
    const [currentWeather, setCurrentWeather] = useState([])
    const [location, setLocation] = useState([])
    const [future, setFuture] = useState([])
    const [forecast, setForecast] = useState([])
    const [error, setError] = useState([])

    useEffect(() => {
        const controller = new AbortController()

        async function getWeatherData() {
            try {
                setError('')
                if (!query) return

                const res = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&api=yes`
                )

                if (!res.ok) {
                    throw new Error('Something went wrong with fetching data')
                }

                const data = await res.json()

                if (data.Response === 'False') {
                    throw new Error('Data not found!')
                }

                setCurrentWeather(data.current)
                setLocation(data.location)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log(err.message)
                    setError(err.message)
                }
                setError(err.message)
            } finally {
                setError('')
            }
        }

        getWeatherData()

        return function () {
            controller.abort()
        }
    }, [query])

    useEffect(() => {
        const controller = new AbortController()

        async function getFutureData() {
            try {
                setError('')
                if (!query) return

                const res = await fetch(
                    `https://api.weatherapi.com/v1/future.json?key=${API_KEY}&q=${query}&dt=2023-10-12`
                )

                if (!res.ok) {
                    throw new Error('Something went wrong with fetching data')
                }

                const data = await res.json()

                if (data.Response === 'False') {
                    throw new Error('Dat not found!')
                }

                setFuture(data?.forecast?.forecastday[0]?.hour)
                setError('')
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.log(err.message)
                    setError(err.message)
                }
                setError(err.message)
            } finally {
                setError('')
            }
        }
        getFutureData()

        return function () {
            controller.abort()
        }
    }, [query])

    useEffect(() => {
        const controller = new AbortController()

        async function getForecast() {
            try {
                setError('')
                if (!query) return
                const res = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&aqi=yes&alerts=yes`
                )

                if (!res.ok) {
                    throw new Error('Something went wrong with fetching data')
                }

                const data = await res.json()

                if (data.Response === 'False') {
                    throw new Error('Data not found!')
                }

                setForecast(data?.forecast?.forecastday[0]?.astro)
                setError('')
            } catch (err) {
                if (err.message !== 'AbortError') {
                    console.log(err.message)
                    setError(err.message)
                }
                setError(err.message)
            } finally {
                setError('')
            }
        }

        getForecast()

        return function () {
            controller.abort()
        }
    }, [query])

    return (
        <div className="wrapper">
            <Main
                currentWeather={currentWeather}
                query={query}
                setQuery={setQuery}
                location={location}
                future={future}
                forecast={forecast}
                error={error}
            />
        </div>
    )
}

function Main({
    query,
    setQuery,
    currentWeather,
    location,
    future,
    forecast,
    error,
}) {
    return (
        <main className="main">
            <div className="main__container container-main">
                <Sidebar
                    query={query}
                    setQuery={setQuery}
                    currentWeather={currentWeather}
                    location={location}
                />
                <div className="left-content">
                    <WeatherMenu
                        error={error}
                        future={future}
                        currentWeather={currentWeather}
                    />
                    <WeatherHighlights
                        currentWeather={currentWeather}
                        forecast={forecast}
                    />
                </div>
            </div>
        </main>
    )
}

function Sidebar({ query, setQuery, currentWeather, location }) {
    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <form className="search">
                    <IoMdSearch className="search__icon" />
                    <input
                        className="search__input"
                        type="text"
                        value={query}
                        placeholder="Search city"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                {currentWeather ? (
                    <img
                        className="weather-img"
                        src={
                            currentWeather?.condition?.icon
                                ? currentWeather.condition.icon
                                : Cloud
                        }
                        alt="cloud img"
                    />
                ) : (
                    <img
                        className="weather-img"
                        src={Cloud}
                        alt="default icon"
                    />
                )}

                <div className="sidebar-start">
                    <div className="sidebar__location location">
                        <IoIosGlobe className="location__icon" />
                        {location ? (
                            <p className="location__text">
                                {location.name}, {location.country}
                            </p>
                        ) : (
                            <p className="location__text">Srinagar, India</p>
                        )}
                    </div>
                    {currentWeather ? (
                        <p className="sidebar__weather">
                            {currentWeather.feelslike_c}&deg;C
                        </p>
                    ) : (
                        <p className="sidebar__weather">23.5&deg;C</p>
                    )}
                    <div className="sidebar__localtime">
                        <p className="sidebar__day day">Monday</p>
                        <p className="sidebar__time">
                            {location
                                ? location.localtime?.substr(11, 5)
                                : '00:00'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="sidebar__bottom">
                <p className="forecast">The Next Day Forecast</p>
                <Tabbed content={content} />
                {/* <div className="forecast__tabs tabs">
                    <div className="tabs__items">
                        <button className="tab tab-active">2 days</button>
                        <button className="tab">5 days</button>
                        <button className="tab">7 days</button>
                    </div>
                    <div className="tabs__content">
                        <div className="content__item item-content">
                            <div className="item-content__imageHolder">
                                <img
                                    src={Storm}
                                    alt="storm"
                                    className="item-content__img"
                                />
                            </div>
                            <div className="item-content__text">
                                <p className="item-content__day">
                                    Tuesday, June 13
                                </p>
                                <p className="item-content__descr">
                                    Storm showers
                                </p>
                            </div>
                        </div>
                        <div className="content__item item-content">
                            <div className="item-content__imageHolder">
                                <img
                                    src={Cloudly}
                                    alt="clodly"
                                    className="item-content__img"
                                />
                            </div>
                            <div className="item-content__text">
                                <p className="item-content__day">
                                    Tuesday, June 13
                                </p>
                                <p className="item-content__descr">
                                    Clodly day
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

function Tabbed({ content }) {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <div>
            <div className="tabs">
                {content.map((tc) => (
                    <Tab
                        tc={tc}
                        num={tc.id}
                        key={tc.tab}
                        activeTab={activeTab}
                        onClick={setActiveTab}
                    />
                ))}
            </div>

            {activeTab <= content.length && (
                <TabDetails
                    item={content.at(activeTab)}
                    key={content.at(activeTab).id}
                />
            )}
        </div>
    )
}

function Tab({ num, activeTab, onClick, tc }) {
    return (
        <button
            className={activeTab === num ? 'tab active' : 'tab'}
            onClick={() => onClick(num)}
        >
            {tc.tab}
        </button>
    )
}

function TabDetails({ item }) {
    return (
        <div className="tab-content">
            <h4>{item.tab}</h4>
            <p>{item.content}</p>
        </div>
    )
}

function WeatherMenu({ future, currentWeather, error }) {
    const weatherForecast = future?.slice(-6)

    return (
        <div className="weather-menu">
            {!error && (
                <div className="weahter-menu__top top-menu">
                    <h1 className="top-menu__title">
                        {currentWeather?.condition?.text}
                    </h1>
                    <ul className="top-menu__list">
                        {weatherForecast?.map((forecast) => (
                            <WeatherForecastForDay
                                forecast={forecast}
                                key={forecast.time}
                            />
                        ))}
                    </ul>
                </div>
            )}
            {error && <Error message={error} />}
        </div>
    )
}

function Error({ message }) {
    return <p>{message}</p>
}

function WeatherForecastForDay({ forecast }) {
    return (
        <li className="top-menu__item menu-item">
            <p className="menu-item__time">{forecast.time.substr(11, 5)}</p>
            <div className="menu-item__imageHolder">
                <img
                    src={forecast.condition.icon}
                    alt="weahter icon"
                    className="menu-item__icon"
                />
            </div>
            <h3 className="menu-item__weather">{forecast.feelslike_c}&deg;C</h3>
        </li>
    )
}

function WeatherHighlights({ currentWeather, forecast }) {
    return (
        <div className="weather-highlights">
            {currentWeather && (
                <>
                    <h2 className="highlights__title">Today's Highlights</h2>
                    <div className="highlights__content">
                        <ul className="highligths__list">
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    UV Index - {currentWeather.uv}
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Wind Speed - {currentWeather.wind_kph} Km/h
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Sunrise - {forecast?.sunrise}
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Sunset - {forecast?.sunset}
                                </p>
                            </li>
                        </ul>
                        <ul className="highligths__list">
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Humidity - {currentWeather.humidity}%
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Visibility - {currentWeather.vis_km}
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Pressure - {currentWeather.pressure_in}
                                </p>
                            </li>
                            <li className="highlights__item">
                                <p className="hightlights__text">
                                    Air Qaulity - {forecast.current}
                                </p>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    )
}

export default App
