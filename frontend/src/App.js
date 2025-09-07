import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function App() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [stationFilter, setStationFilter] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");

  const [loadingStations, setLoadingStations] = useState(true);
  const [stationsError, setStationsError] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);

  // Ambil daftar stasiun
  useEffect(() => {
    if (!API_URL) {
      console.error("REACT_APP_API_URL not defined");
      return;
    }

    setLoadingStations(true);
    fetch(`${API_URL}/v1/api/stations/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStations(data.data);
        } else {
          setStationsError(new Error("Failed to fetch stations"));
        }
      })
      .catch((err) => setStationsError(err))
      .finally(() => setLoadingStations(false));
  }, []);

  // Ambil jadwal saat stasiun dipilih
  const fetchSchedule = (nid) => {
    setLoadingSchedule(true);
    setScheduleError(null);

    fetch(`${API_URL}/v1/api/stations/${nid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchedule(data.data);
          setSelectedStation(nid);
          setScheduleFilter(""); // reset filter jadwal saat ganti stasiun
        } else {
          setSchedule([]);
          setScheduleError(new Error("No schedule available"));
        }
      })
      .catch((err) => setScheduleError(err))
      .finally(() => setLoadingSchedule(false));
  };

  return (
    <div className="container">
      {/* Title Box */}
      <h1 className="title-box">
        🚇 Daftar Stasiun MRT Jakarta{" "}
        <span className="count">({stations.length})</span>
      </h1>

      {/* Filter stasiun */}
      <div className="filter-box">
        <input
          type="text"
          placeholder="Cari stasiun..."
          value={stationFilter}
          onChange={(e) => setStationFilter(e.target.value)}
        />
      </div>

      {/* Loading & Error Stations */}
      {loadingStations && <p>Loading stations...</p>}
      {stationsError && <p className="error">Error: {stationsError.message}</p>}

      {/* Grid stasiun */}
      <div className="station-grid">
        {stations
          .filter((station) =>
            station.title.toLowerCase().includes(stationFilter.toLowerCase())
          )
          .map((station) => (
            <button
              key={station.nid}
              onClick={() => fetchSchedule(station.nid)}
              className={`station-btn ${
                selectedStation === station.nid ? "active" : ""
              }`}
            >
              <p className="station-title">{station.title}</p>
              <span className="station-id">ID: {station.nid}</span>
            </button>
          ))}
      </div>

      {/* Jadwal */}
      <div className="schedule-box">
        <h2>📅 Jadwal Keberangkatan</h2>

        {/* Loading & Error Schedule */}
        {loadingSchedule && <p>Loading schedule...</p>}
        {scheduleError && <p className="error">Error: {scheduleError.message}</p>}

        {/* Filter jadwal */}
        {selectedStation && schedule.length > 0 && (
          <div className="filter-box">
            <input
              type="text"
              placeholder="Cari jadwal..."
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
            />
          </div>
        )}

        {!selectedStation && <p className="empty">Pilih stasiun untuk melihat jadwal</p>}
        {selectedStation && schedule.length === 0 && !loadingSchedule && !scheduleError && (
          <p className="empty">Tidak ada jadwal untuk stasiun ini</p>
        )}

        <ul>
          {schedule
            .filter(
              (item) =>
                item.station.toLowerCase().includes(scheduleFilter.toLowerCase()) ||
                item.time.includes(scheduleFilter)
            )
            .map((item, index) => (
              <li key={index} className="schedule-item">
                <span className="station-name">{item.station}</span> —{" "}
                <span className="time">{item.time}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
