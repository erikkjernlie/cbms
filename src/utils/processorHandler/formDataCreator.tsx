import { DataInput } from "src/types/datahandling";

export function createProcessorInputFormData(inputs: DataInput[]) {
  let formData = new FormData();
  const insertedInputs = inputs.filter(
    (input: DataInput) => input.measurement_ref !== -1
  );
  if (insertedInputs.length === 0) {
    return formData;
  }
  insertedInputs.forEach((input: DataInput, index: number) => {
    formData.append("input_ref", input.valueReference.toString());
    formData.append("measurement_ref", input.measurement_ref.toString());
    formData.append(
      "measurement_proportion",
      input.measurement_proportion.toString()
    );
    formData.append("input_name", input.name);
  });
  return formData;
}

export function createProcessorOutputFormData(
  outputs: any,
  formData: FormData
) {
  if (formData === undefined) {
    formData = new FormData();
  }
  for (let i = 0; i < outputs.length; i++) {
    const matrixOutputs = outputs[i].matrixOutputNames;
    if (matrixOutputs === undefined) {
      formData.append("output_ref", outputs[i].valueReference);
    } else {
      matrixOutputs.forEach((output: any) => {
        formData.append("output_ref", output.id);
      });
    }
  }
  return formData;
}

export function createProcessorFormData(
  processorId: string,
  selectedBlueprint: string,
  initParams: any,
  source: string
) {
  let formData = new FormData();
  formData.append("id", processorId);
  formData.append("blueprint", selectedBlueprint);
  formData.append("init_params", JSON.stringify(initParams));
  formData.append("topic", source);
  formData.append("min_output_interval", "0.01");
  return formData;
}
