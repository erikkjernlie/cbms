import { Source } from "./datasource";

export interface Buffer {
  unpacker: any;
  timestamp_buffer: any;
  value_buffer: any;
  delay: number;
  timestamp?: Date;
}

export interface TileFormat {
  id: string;
  name: string;
  type: string;
  fill?: string;
  mode?: string;
  frequency?: number;
  category:
    | "real-time"
    | "history"
    | "youtube"
    | "model"
    | "map"
    | "spectrogram"
    | "statistics"
    | "statistics_distribution"
    | "fft"
    | "predictions"
    | "history-predictions";
  subscribedChannels?: Source[];
  channels?: Source[];
}

export interface Histogram {
  values: number[];
  bins: number;
  binWidth: number;
  binLimits: number[];
}

export interface DataInput {
  valueReference: number;
  name: string;
  measurement_ref: number;
  measurement_proportion: number;
}

export interface DataOutput {
  valueReference: number;
  name: string;
}

export interface FilterParams {
  btype: string;
  sample_spacing: number;
  cutoff_frequency: number;
  buffer_size: number;
  order: number;
}

export interface FilterFormat {
  channel: Source;
  name: string;
  params: FilterParams;
}

export interface TriggerData {
  max: string | number;
  min: string | number;
  name: string;
  minDescription: string;
  maxDescription: string;
  maxSeverityLevel: string;
  minSeverityLevel: string;
}

export interface EventTriggerParams {
  number_of_inputs: number;
  trigger_inputs: any;
  project_id: string;
}

export interface INotification {
  startedAt: Timestamp;
  endedAt: Timestamp;
  finished: boolean;
  id: string;
  description: string;
  severity: string;
  sensor: string;
  triggerReason: string;
  valueExceeded: number;
}

export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}
