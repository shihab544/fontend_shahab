// App.js
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Chart } from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import "./App.css";

// Register the zoom plugin
Chart.register(zoomPlugin);

const Home = () => {
    return (
        <div className="home-container">
            <h2>Welcome to the Dashboard</h2>
            <p>This is the home page of your dashboard application.</p>
        </div>
    );
};

const About = () => {
    return (
        <div className="about-container">
            <h2>About</h2>
            <p>This dashboard application is designed to showcase weather data performance with interactive visualizations and user-friendly navigation.</p>
            <h3>Group Members</h3>
            <ul>
                <li>Shimul Paul - Matriculation No: 1441927</li>
                <li>Abu Sayeed Bin Mozahid - Matriculation No: 1504365</li>
                <li>Md Shahab Uddin - Matriculation No: 1505119</li>
            </ul>
            <h3>Summary</h3>
            <p>The Weather and Pollution Monitoring System is an IoT-based solution that uses NodeMCU and environmental sensors to collect real-time weather and pollution data. This data includes parameters such as temperature, humidity, air quality, and specific pollutants like particulate matter and gases. The system leverages cloud storage for data collection and analysis, and a web dashboard for visualization and monitoring. Alerts are triggered for high pollution levels or severe weather events, making it a valuable tool for urban, industrial, or residential environments.</p>
        </div>
    );
};

const Dashboard = () => {
    const chartRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState("temperature");
    const [selectedDays, setSelectedDays] = useState("today");

    const data = [
        {
            id: 5,
            timestamp: "2024-12-18T20:45:17.094Z",
            temperature: 21.7,
            humidity: 63.1,
            air_quality: 2955,
            gas_mq2: 2979,
            gas_mq4: 3274,
            dust: 0,
        },
        {
            id: 4,
            timestamp: "2024-12-18T20:45:12.853Z",
            temperature: 21.7,
            humidity: 63.2,
            air_quality: 2960,
            gas_mq2: 2989,
            gas_mq4: 3269,
            dust: 0,
        },
        {
            id: 3,
            timestamp: "2024-12-18T20:45:08.595Z",
            temperature: 21.7,
            humidity: 63.2,
            air_quality: 2959,
            gas_mq2: 2977,
            gas_mq4: 3283,
            dust: 0,
        },
        {
            id: 2,
            timestamp: "2024-12-18T20:45:04.342Z",
            temperature: 21.8,
            humidity: 63.5,
            air_quality: 2960,
            gas_mq2: 2985,
            gas_mq4: 3293,
            dust: 0,
        },
        {
            id: 1,
            timestamp: "2024-12-18T20:44:59.960Z",
            temperature: 21.7,
            humidity: 64.4,
            air_quality: 2962,
            gas_mq2: 2979,
            gas_mq4: 3281,
            dust: 0,
        },
    ];

    const filterDataByDays = () => {
        const now = new Date();
        return data.filter((entry) => {
            const entryDate = new Date(entry.timestamp);
            if (selectedDays === "today") {
                return entryDate.toDateString() === now.toDateString();
            } else if (selectedDays === "yesterday") {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                return entryDate.toDateString() === yesterday.toDateString();
            } else if (selectedDays === "last7days") {
                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return entryDate >= sevenDaysAgo;
            } else if (selectedDays === "last30days") {
                const thirtyDaysAgo = new Date(now);
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return entryDate >= thirtyDaysAgo;
            }
            return true;
        });
    };

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Filtered data based on selected days
        const filteredData = filterDataByDays();
        const labels = filteredData.map((entry) => new Date(entry.timestamp).toLocaleTimeString());

        const datasets =
            selectedOption === "all"
                ? [
                      {
                          label: "Temperature (°C)",
                          data: filteredData.map((entry) => entry.temperature),
                          borderColor: "rgba(75, 192, 192, 1)",
                          backgroundColor: "rgba(75, 192, 192, 0.2)",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: 3,
                          pointBackgroundColor: "rgba(75, 192, 192, 1)",
                      },
                      {
                          label: "Humidity (%)",
                          data: filteredData.map((entry) => entry.humidity),
                          borderColor: "rgba(255, 99, 132, 1)",
                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: 3,
                          pointBackgroundColor: "rgba(255, 99, 132, 1)",
                      },
                  ]
                : [
                      {
                          label: `${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} Data`,
                          data: filteredData.map((entry) => entry[selectedOption]),
                          borderColor: "rgba(153, 102, 255, 1)",
                          backgroundColor: "rgba(153, 102, 255, 0.2)",
                          borderWidth: 2,
                          tension: 0.4,
                          pointRadius: 3,
                          pointBackgroundColor: "rgba(153, 102, 255, 1)",
                      },
                  ];

        // Create the chart instance
        const chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Weather Data Performance",
                    },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: "x",
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: "x",
                        },
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Timestamp",
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Values",
                        },
                    },
                },
            },
        });

        // Clean up to destroy the chart when the component unmounts
        return () => {
            chartInstance.destroy();
        };
    }, [selectedOption, selectedDays]);

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <p>Here is your main dashboard content.</p>

            <div className="dropdown-container">
                <label htmlFor="data-selector">Select Data Type: </label>
                <select
                    id="data-selector"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <option value="temperature">Temperature</option>
                    <option value="humidity">Humidity</option>
                    <option value="air_quality">Air Quality</option>
                    <option value="gas_mq2">Gas MQ2</option>
                    <option value="gas_mq4">Gas MQ4</option>
                    <option value="dust">Dust</option>
                    <option value="all">All Data</option>
                </select>

                <label htmlFor="days-selector">Select Time Range: </label>
                <select
                    id="days-selector"
                    value={selectedDays}
                    onChange={(e) => setSelectedDays(e.target.value)}
                >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                </select>
            </div>

            <div className="chart-container">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1 className="app-title">Simple Dashboard</h1>
                    <nav className="menu-bar">
                        <ul className="menu-list">
                            <li className="menu-item"><Link to="/" className="menu-link">Home</Link></li>
                            <li className="menu-item"><Link to="/dashboard" className="menu-link">Dashboard</Link></li>
                            <li className="menu-item"><Link to="/about" className="menu-link">About</Link></li>
                        </ul>
                    </nav>
                </header>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>

                <footer className="footer">
                    <p>&copy; 2024 Simple Dashboard. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;  