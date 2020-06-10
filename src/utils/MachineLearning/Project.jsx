import React, { useState } from "react";
import "./Project.css";
import { fetchModel, loadData } from "./transferLib.js";

let dataPoints;
let sensors = [];
let sensorData;

function setDataPoints(p) {
  dataPoints = p;
}

function setSensors(s) {
  sensors = s;
}

function setSensorData(d) {
  sensorData = d;
}

const Project = (props) => {
  const projectName = props.name;
  const [currentSensor, setCurrentSensor] = useState("");

  const [liveData, setLiveData] = useState(true);

  const [CSVData, setCSVData] = useState(null);

  if (!CSVData) {
    loadData(projectName, setCSVData);
  }

  const [loading, setLoading] = useState(false);

  const lastLoadedProjectName = projectName;

  const model = fetchModel(projectName);

  const config = props.config;

  let plot_y = [];
  let plot_pred = [];

  const changeLiveData = (liveData) => {
    setLiveData(liveData);
  };

  return (
    <div className="Container">
      <div className="CurrentProject__Title">
        Project: {lastLoadedProjectName}
      </div>
      {loading && <div>Loading data...</div>}
      {projectName === undefined &&
        lastLoadedProjectName &&
        lastLoadedProjectName.length === 0 && (
          <div>You currently have no current project selected. </div>
        )}

      <button onClick={() => changeLiveData(!liveData)}>
        See {!liveData ? "live data" : "historical data"}.
      </button>
      {!loading && config && (
        <div>
          {
            <div className={liveData ? "show" : "hide"}>
              {/*<MySocket
                projectName={props.name}
                model={model}
                config={config}
              />*/}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default Project;
