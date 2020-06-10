export interface RawTopic {
  byte_format: string;
  output_names: string[];
  url: string;
  matrix_outputs?: any;
}

export interface Topic {
  id: string;
  channels: Channel[];
  byteFormat: string;
  url: string;
}

export interface TopicsJson {
  [id: string]: {
    byte_format: string;
    output_names: string[];
    url: string;
  };
}

export interface Source {
  channel: Channel;
  topicId: string;
}

export interface Channel {
  channelName: string;
  id: number;
}

export interface EditedSelectedSource {
  id: string;
  subscribedChannels: Channel[];
  byteFormat: string;
  url: string;
  name: string;
}

export interface SelectedSource {
  byteFormat: string;
  channels: Channel[];
  id: string;
  url: string;
  selectedChannels: Channel[];
}

export interface Datasource {
  name: string;
  type: string;
  topic: string;
  id: string;
  initialized: boolean;
  running: boolean;
  channels: string[];

  blueprint_id?: string;
  init_params?: any;
  start_params?: any;
  source_topic?: string;
  source_format?: string;
  input_refs?: string;
  output_refs?: string;
  actual_input_refs?: string;
  actual_output_refs?: string;
  measurement_refs?: string;
  output_names?: string[];

  inputs?: any[];
  outputs?: any[];

  byte_format?: string;
  processor_dir?: string;
}
