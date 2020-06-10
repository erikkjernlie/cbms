import { Datasource } from "src/types/datasource";
import create from "zustand";
import {
  getProjectSources,
  deleteProjectSource,
  addProjectSource
} from "src/backendAPI/datasources";

const [useDatasourceStore] = create((set, get) => ({
  sourceList: [] as Datasource[],
  fetchSourcesFromDatabase: async (projectId: string) => {
    let sourceList = [] as Datasource[];
    const response = await getProjectSources(projectId);
    if (response) {
      response.map((element: string) => {
        const notJSON = JSON.parse(element);
        if (notJSON.addr) {
          sourceList.push({
            name: notJSON.name,
            type: "datasource",
            topic: notJSON.topic,
            initialized: true,
            running: notJSON.running,
            channels: notJSON.output_names,
            id: notJSON.id
          } as Datasource);
        } else {
          sourceList.push({
            name: notJSON.processor_id,
            type: "processor",
            topic: notJSON.topic,
            id: notJSON.id,
            initialized: notJSON.initialized,
            running: notJSON.started,
            channels:
              notJSON.inputs === undefined
                ? null
                : Object.entries(notJSON.inputs).map(
                    (input: any) => input[1].name
                  ),
            output_names:
              notJSON.outputs === undefined
                ? null
                : Object.entries(notJSON.outputs).map(
                    (output: any) => output[1].name
                  ),
            blueprint_id: notJSON.blueprint_id,
            init_params: notJSON.init_params,
            start_params: notJSON.start_params,
            source_topic: notJSON.source_topic,
            source_format: notJSON.source_format,
            input_refs: notJSON.input_refs,
            output_refs: notJSON.output_refs,
            actual_input_refs: notJSON.actual_input_refs,
            actual_output_refs: notJSON.actual_output_refs,
            measurement_refs: notJSON.measurement_refs,
            outputs: notJSON.outputs,
            inputs: notJSON.inputs,
            byte_format: notJSON.byte_format,
            processor_dir: notJSON.processor_dir
          } as Datasource);
        }
      });

      set({
        sourceList: sourceList
      });
    }
  },
  addSourceToDatabase: async (
    projectId: string,
    processorName: string,
    processorType: string
  ) => {
    const response = await addProjectSource(
      projectId,
      processorType,
      processorName
    );
    if (response.ok) {
      get().fetchSourcesFromDatabase(projectId);
      return true;
    }
    return false;
  },
  deleteSourceFromDatabase: async (projectId: string, processorId: string) => {
    const response = await deleteProjectSource(projectId, processorId);
    if (response.ok) {
      get().fetchSourcesFromDatabase(projectId);
      return true;
    }
    return false;
  }
}));

export default useDatasourceStore;
