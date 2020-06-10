import { Channel, RawTopic } from "src/types/datasource";

export const bundleMatrixOutput = (
  allOutputs: Channel[],
  matrixOutputRefs: any
) => {
  const matrixOutputs = Object.entries(matrixOutputRefs).map((matrixOutput) => {
    const matrixOutputIndices = matrixOutput[1] as any;
    let matrixChannels = [] as any;
    // Fetch matrixchannels from scalaroutputs which holds all the output channels when entering this function
    matrixOutputIndices.forEach((index: any) => {
      const matrixChannel = allOutputs[index];
      matrixChannels.push(matrixChannel);
    });
    return {
      channelName: matrixOutput[0] + "_matrix",
      outputChannels: matrixChannels,
    };
  });
  // Filter out scalar outputs based on if the name does not contain '_mXY' where X and Y are integers
  const scalarOutputs = allOutputs.filter(
    (channel: Channel) => !/_m\d\d/.test(channel.channelName)
  );
  // return scalarOutputs.concat(matrixOutputs);
  return scalarOutputs;
};

// if we have matrix-data instead of arrays: Only applicable for processors
// ENDRET AV ANNE P 20.03.20
export const unBundleMatrixChannels = (channels: Channel[]) => {
  // unbundling matrix channels
  const matrixChannels =
    channels
      .filter((channel: Channel) => channel.channelName.includes("_matrix"))
      .flatMap((channel: any) => channel.outputChannels) || ([] as Channel[]);
  // putting scalar channels together with the matrix ones
  channels.filter(
    (channel: Channel) => !channel.channelName.includes("_matrix")
  );

  matrixChannels.forEach((channel: Channel | undefined, index: number) => {
    if (channel !== undefined) channels.push(channel);
  });
  return channels;
};

export const makeChannels = (topicJSON: RawTopic) => {
  if (topicJSON.output_names === undefined) {
    return [];
  }
  const matrixOutputRefs = topicJSON.matrix_outputs;
  let allOutputs = topicJSON.output_names.map(
    (output_name: string, index: number) =>
      ({
        id: index,
        channelName: output_name,
      } as Channel)
  );
  if (
    matrixOutputRefs === undefined ||
    Object.keys(matrixOutputRefs).length === 0
  ) {
    // There exists no matrixOutputs return all outputs as they are
    return allOutputs;
  }

  return bundleMatrixOutput(allOutputs, matrixOutputRefs);
};
