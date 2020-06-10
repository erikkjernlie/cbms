import { SyntheticEvent, useState } from "react";
import { fetchBlueprint } from "src/backendAPI/blueprints";
import { getOutputNames } from "src/backendAPI/datasources";
import {
  createProcessor,
  fetchProcessorInformation,
  processorSetInput,
  processorSetOutput,
  startProcessorRequest,
} from "src/backendAPI/processors";
import { fetchTopics, subscribeToSource } from "src/backendAPI/topics";
import useDatasourceStore from "src/stores/project/datasourceStore";
import { IDictionary } from "src/types";
import { DataInput } from "src/types/datahandling";
import {
  Channel,
  RawTopic,
  Source,
  Topic,
  TopicsJson,
} from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";

import { deepCopy } from "../util";
import {
  createProcessorInputFormData,
  createProcessorOutputFormData,
} from "./formDataCreator";

export const useProcessorStarter = () => {
  const [started, setStarted] = useState(false);
  const [created, setCreated] = useState(false);

  const { addSourceToDatabase } = useDatasourceStore();

  const getInitParams = async (type: string) => {
    let newParams = {} as IDictionary<string>;

    const jsonResponse = await fetchBlueprint(type);
    jsonResponse.init_params.forEach((element: any) => {
      newParams[element.name] = element.default;
    });

    return newParams;
  };

  const makeInputFormData = (input: any[]) => {
    let fd = new FormData();
    fd.append("input_ref", input[0].valueReference.toString());
    fd.append("measurement_ref", input[0].measurement_ref.toString());
    fd.append(
      "measurement_proportion",
      input[0].measurement_proportion.toString()
    );
    return fd;
  };

  const initiateProcessor = async (
    projectId: string,
    type: string,
    data: any
  ) => {
    let resp;
    const initParams = {
      ...data.params,
      inputs: [
        {
          valueReference: 0,
          name: data.channel.channel.channelName,
          measurement_ref: data.channel.channel.id,
          measurement_proportion: 1,
        },
      ],
      outputs: [
        {
          valueReference: 0,
          name: data.name,
        },
      ],
    };

    let formData = {} as FormData;
    formData = createProcessorFormData(
      data.name,
      type,
      initParams,
      data.channel.topicId
    );
    try {
      let response = await createProcessor(formData);
      setCreated(true);
      formData = makeInputFormData(initParams.inputs);
      response = await processorSetInput(data.name, formData);
      formData = new FormData();
      response = await processorSetOutput(data.name, formData);
      formData = getStartForm(
        {
          inputs: initParams.inputs,
          outputs: initParams.outputs,
        },
        {},
        data.name
      );
      response = await startProcessorRequest(formData);
      setStarted(true);
      response = await addSourceToDatabase(projectId, data.name, "processor");
      return "";
    } catch (error) {
      return error.toString();
    }
  };

  // uses data about processor to find and set the start_params
  // [Executed internally in loadProcessor]
  const findStart = async (processorJSON: any) => {
    let newParams = {} as IDictionary<string>;
    const blueprint = processorJSON.blueprint_id;
    const startParamResponse = await fetchBlueprint(blueprint);
    startParamResponse.start_params.forEach((element: any) => {
      newParams[element.name] = element.default;
    });
    return newParams;
  };

  // Loads processor with given name and sets processor data
  const loadProcessor = async (processorName: string) => {
    let processor;
    let startparams = {};
    let dSC = null;

    const processorJSON = await fetchProcessorInformation(processorName);
    const processorIOs = extractProcessorIOs(processorJSON);
    if (!processorJSON.started) {
      startparams = await findStart(processorJSON);
    }
    if (processorIOs) {
      processor = processorIOs;
      dSC = await getOutputNames("/topics/" + processorJSON.source_topic);
    }
    return { startparams, processor, dSC };
  };

  // finds and formats processor IO
  // [Executed internally in loadProcessor]
  const extractProcessorIOs = (processorJSON: any) => {
    if (
      processorJSON.inputs === undefined &&
      processorJSON.outputs === undefined
    ) {
      return false;
    }
    const selectedMeasurementRefs = processorJSON.measurement_refs;
    const inputs = processorJSON.inputs.map(
      (input: DataInput, index: number) => ({
        valueReference: index,
        name: input.name,
        measurement_ref: selectedMeasurementRefs[index] || -1,
        measurement_proportion: 1,
      })
    );
    const matrixOutputRefs = processorJSON.matrix_outputs;
    const outputRefs = processorJSON.output_refs;
    let scalarOutputs = processorJSON.outputs.map(
      (output: any, index: number) => ({
        id: index,
        name: output.name,
        selected: outputRefs.includes(index),
      })
    );
    if (matrixOutputRefs !== undefined) {
      const allOutputs = deepCopy(scalarOutputs);
      const matrixOutputs = Object.entries(matrixOutputRefs).map(
        (matrixOutput: any) => {
          const matrixOutputIndices = matrixOutput[1];
          return {
            name: matrixOutput[0] + "_matrix",
            selected: outputRefs.includes(matrixOutputIndices[0]),
            matrixOutputNames: allOutputs.filter(
              (output: any, index: number) => {
                if (matrixOutputIndices.includes(index)) {
                  scalarOutputs.splice(index);
                  return true;
                }
              }
            ),
          };
        }
      );
      return { inputs: inputs, outputs: scalarOutputs.concat(matrixOutputs) };
    }
  };

  const startProcessor = async (
    processor: any,
    startParams: any,
    processorName: string,
    e?: SyntheticEvent
  ) => {
    if (e) {
      e.preventDefault();
    }

    let formData = getStartForm(processor, startParams, processorName);
    try {
      await startProcessorRequest(formData);
    } catch (error) {
      return "Error starting processor";
    }
    setStarted(true);
    return;
  };

  const createProcessorFormData = (
    processorId: string,
    selectedBlueprint: string,
    initParams: any,
    source: string
  ) => {
    let fd = new FormData();
    fd.append("id", processorId);
    fd.append("blueprint", selectedBlueprint);
    fd.append("init_params", JSON.stringify(initParams));
    fd.append("topic", source);
    fd.append("min_output_interval", "0.01");
    return fd;
  };

  const getStartForm = (
    processor: any,
    startParams: any,
    processorName: string
  ) => {
    let formData = new FormData();
    formData = createProcessorInputFormData(processor.inputs);
    formData = createProcessorOutputFormData(processor.outputs, formData);
    formData.append("id", processorName);
    formData.append("start_params", JSON.stringify(startParams));
    return formData;
  };

  return {
    getInitParams,
    createProcessorFormData,
    loadProcessor,
    startProcessor,
    started,
    created,
    initiateProcessor,
  };
};
