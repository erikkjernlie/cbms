import * as tf from "@tensorflow/tfjs";
import cloneDeep from "lodash.clonedeep";
import React, { useEffect, useState } from "react";
import { rootAPI } from "src/backendAPI/api";
import Button from "src/Components/UI/Button/Button";
import * as Q from "src/Routes/NewProjectRoute/NewProject.style";

import {
  convertToTensors,
  getBasicModel,
  getBasicModelWithRegularization,
  getComplexModel,
  getComplexModelWithRegularization,
  getFeatureTargetSplit,
  getTestTrainSplit,
} from "./machineLearningLib.js";
import {
  fillConfigWithDataValues,
  getR2Score,
  getReducedDataset,
  normalizeData,
  shouldStandardize,
  shuffleData,
  standardizeData,
} from "./statisticsLib.js";
import { loadConfig, loadData, uploadProcessedConfig } from "./transferLib.js";

const modelParams = {
  test_train_split: 0.2,
  activation: "relu",
  learningRate: 0.01,
  epochs: 10,
  optimizer: tf.train.adam(0.01),
  loss: "meanSquaredError",
  min_R2_score: 0.5,
  decent_R2_score: 0.8,
  max_mean_diff: 100,
  max_std_diff: 10,
  cov_limit: 0.9,
  max_iterations: 4,
};

const DataInfo = (props) => {
  return (
    <div>
      <p>Input columns: {props.info.input}</p>
      <p>Output columns: {props.info.output}</p>
      <p>Number of training points: {props.info.training}</p>
      <p>Number of testing points: {props.info.testing}</p>
    </div>
  );
};

const TrainModel = (props) => {
  const [lastStep, setLastStep] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [dataInfo, setDataInfo] = useState({});
  const [hasTrained, setHasTrained] = useState(false);
  const [trainingFailed, setTrainingFailed] = useState(false);
  const [R2, setR2] = useState(-1000);

  let configLocal;
  let dataPointsLocal;

  function setConfigLocal(val) {
    configLocal = val;
  }

  function setDataPointsLocal(val) {
    dataPointsLocal = val;
  }

  const [dataPointsProcessed, setDataPointsProcessed] = useState([]);
  const [configProcessed, setConfigProcessed] = useState([]);

  const fetchData = async () => {
    await loadConfig(props.name, setConfigLocal);
    await loadData(props.name, setDataPointsLocal);
  };

  function preprocessData(data) {
    data = data.filter(
      (x) => !Object.values(x).some((y) => y === "" || y == null)
    );
    return data;
  }

  async function train(data, conf) {
    let configuration = cloneDeep(conf);
    let useRegularization = false;
    data = preprocessData(data);
    const sensors = fillConfigWithDataValues(data, configuration);
    let c = cloneDeep(configLocal);
    c["sensors"] = sensors;
    setConfigLocal(c);

    data = shuffleData(data);

    let [features, targets] = getFeatureTargetSplit(data, configuration);
    if (configuration.reduceTrainingTime && configuration.input.length > 2) {
      features = getReducedDataset(features, modelParams.cov_limit);
    }

    let joinedData = [];
    for (var i = 0; i < features.length; i++) {
      joinedData.push(features[i].concat(targets[i]));
    }

    if (
      shouldStandardize(
        joinedData,
        modelParams.max_mean_diff,
        modelParams.max_std_diff
      )
    ) {
      features = standardizeData(features, configuration);
      setConfigLocal({
        ...configLocal,
        differentValueRanges: true,
      });
      configuration.differentValueRanges = true;
    } else {
      features = normalizeData(features, configuration);
      configuration.differentValueRanges = false;
      setConfigLocal({
        ...configLocal,
        differentValueRanges: false,
      });
    }

    const [x_train, x_test, y_train, y_test] = getTestTrainSplit(
      features,
      targets,
      modelParams.test_train_split
    );

    const tensors = convertToTensors(x_train, x_test, y_train, y_test);

    let model;
    let predictions;
    let tempR2 = 0;
    let trainCounter = 0;
    while (tempR2 < modelParams.min_R2_score) {
      if (trainCounter > 1) {
        useRegularization = true;
      }
      model = await trainModel(
        tensors.trainFeatures,
        tensors.trainTargets,
        tensors.testFeatures,
        tensors.testTargets,
        configuration,
        useRegularization
      );
      predictions = model.predict(tensors.testFeatures);
      tempR2 = getR2Score(predictions.arraySync(), y_test).rSquared;
      setR2(tempR2);
      if (!hasTrained) {
        setHasTrained(true);
      }
      trainCounter += 1;
      if (
        trainCounter > modelParams.max_iterations &&
        !(tempR2 >= modelParams.min_R2_score)
      ) {
        setTrainingFailed(true);
        break;
      }
    }

    if (tempR2 >= modelParams.min_R2_score) {
      await model
        .save(rootAPI + "/machinelearning/" + props.name + "/model")
        .then(() => {
          console.log("Model saved to backend");
        });
      //TODO: NOT CORRECT HERE
      uploadProcessedConfig(configLocal, props.name);
      setDataPointsProcessed(dataPointsLocal);
      setConfigProcessed(configLocal);
      setLastStep(true);
    }
  }

  async function trainModel(
    xTrain,
    yTrain,
    xTest,
    yTest,
    configuration,
    regularize
  ) {
    let model;
    if (configuration.isComplex) {
      if (regularize) {
        model = getComplexModel(xTrain.shape[1], yTrain.shape[1], modelParams);
      } else {
        model = getComplexModelWithRegularization(
          xTrain.shape[1],
          yTrain.shape[1],
          modelParams
        );
      }
    } else {
      if (regularize) {
        model = getBasicModel(xTrain.shape[1], yTrain.shape[1], modelParams);
      } else {
        model = getBasicModelWithRegularization(
          xTrain.shape[1],
          yTrain.shape[1],
          modelParams
        );
      }
    }
    model.summary();

    model.compile({
      optimizer: modelParams.optimizer,
      loss: modelParams.loss,
    });

    await model.fit(xTrain, yTrain, {
      epochs: modelParams.epochs,
      validationData: [xTest, yTest],
    });
    setTraining(false);
    props.setFinishedTraining(true);
    return model;
  }

  const [training, setTraining] = useState(false);

  useEffect(() => {
    setTraining(true);
    async function startFetching() {
      await fetchData().then(function (val) {
        setHasLoaded(true);
        setDataInfo({
          input: configLocal.input.join(", "),
          output: configLocal.output,
          training: Math.floor(
            dataPointsLocal.length * (1 - modelParams.test_train_split)
          ),
          testing: Math.ceil(
            dataPointsLocal.length * modelParams.test_train_split
          ),
        });
        train(dataPointsLocal, configLocal);
      });
    }
    startFetching();
  }, [props.name]);

  return (
    <div>
      <Q.Columns>
        <Q.ColumnLeft noPadding={true}></Q.ColumnLeft>
        <Q.ColumnRight noPadding={true}></Q.ColumnRight>
      </Q.Columns>
      <Q.Columns>
        <Q.ColumnLeft noPadding={true}>
          Training on the following data
        </Q.ColumnLeft>
        <Q.ColumnRight noPadding={true}>
          {hasLoaded && dataInfo && <DataInfo info={dataInfo} />}
        </Q.ColumnRight>
      </Q.Columns>
      {hasTrained && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>
            {" "}
            The R2 score reflects the accuracy of the predictions on the test
            set. Perfect predictions will give an R2 score of 1, while always
            guessing the mean will give a score of 0. Anything lower than 0
            means the model performed worse than always guessing the mean.
          </Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            <h4>R2 score: {R2}</h4>
            {R2 >= modelParams.decent_R2_score && (
              <div style={{ backgroundColor: "green", padding: "5px" }}>
                Training was successful
              </div>
            )}
            {R2 >= modelParams.min_R2_score &&
              R2 < modelParams.decent_R2_score && (
                <div style={{ backgroundColor: "yellow", padding: "5px" }}>
                  Training was successful, but with limited accuracy. Consider
                  retraining your model by refreshing
                </div>
              )}
            {trainingFailed && (
              <div>
                <Button
                  className="Simple"
                  onClick={() => window.location.reload(false)}
                >
                  Retry training
                </Button>
              </div>
            )}
          </Q.ColumnRight>
        </Q.Columns>
      )}
      {lastStep && (
        <Q.Columns>
          <Q.ColumnLeft noPadding={true}>retrain model</Q.ColumnLeft>
          <Q.ColumnRight noPadding={true}>
            <Button
              className="Simple"
              onClick={() => window.location.reload(false)}
            >
              Retrain model
            </Button>
          </Q.ColumnRight>
        </Q.Columns>
      )}
    </div>
  );
};

export default TrainModel;
