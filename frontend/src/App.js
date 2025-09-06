import React, { useEffect, useState } from "react";
import "./App.css"; // import file css

export default function App() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [schedule, setSchedule] = useState([]);

  // Ambil daftar stasiun
  useEffect(() => {
    fetch("http://localhost:8080/v1/api/stations/")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStations(data.data);
        }
      })
      .catch((err) => console.error("Error fetch stations:", err));
  }, []);

  // Ambil jadwal saat stasiun dipilih
  const fetchSchedule = (nid) => {
    fetch(`http://localhost:8080/v1/api/stations/${nid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSchedule(data.data);
          setSelectedStation(nid);
        } else {
          setSchedule([]);
        }
      })
      .catch((err) => console.error("Error fetch schedule:", err));
  };

  return (
    <div className="container">
      <h1>🚇 Daftar Stasiun MRT Jakarta</h1>

      {/* Grid stasiun */}
      <div className="station-grid">
        {stations.map((station) => (
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

        {selectedStation && schedule.length === 0 && (
          <p className="empty">Tidak ada jadwal untuk stasiun ini </p>
        )}

        {!selectedStation && (
          <p className="empty">Pilih stasiun untuk melihat jadwal</p>
        )}

        <ul>
          {schedule.map((item, index) => (
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
