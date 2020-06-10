import React, { SyntheticEvent, useState } from "react";
import { subscribeToSource } from "src/backendAPI/topics";
import * as T from "src/Components/Notifications/Notification.style";
import Button from "src/Components/UI/Button/Button";
import { Datasource as DatasourceFormat } from "src/types/datasource";

import * as S from "./Datasources.style";

interface Props {
  source: DatasourceFormat;
  stopOrDelete: (source: DatasourceFormat) => void;
  createOrStart: (e: SyntheticEvent, source: DatasourceFormat) => void;
  editSource: (source: DatasourceFormat) => void;
}

const Datasource = (props: Props) => {
  const { source, stopOrDelete, createOrStart, editSource } = props;

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <T.Notification headerItem={false} key={source.name}>
        <S.DataItem
          headerItem={false}
          size={"large"}
          onClick={() => setShowInfo(!showInfo)}
        >
          {source.name}
        </S.DataItem>
        <S.DataItem headerItem={false} size={"large"}>
          {source.type}
        </S.DataItem>
        <S.DataItem headerItem={false} size={"small"}>
          {source.running
            ? "Running"
            : source.initialized
            ? "Initialized"
            : "Not initialized"}
        </S.DataItem>
        <S.DataItem headerItem={false} size={"small"}>
          {source.initialized ? source.topic : ""}
        </S.DataItem>
        <S.DataItem headerItem={false} size={"small"}>
          {
            <Button
              onClick={(e) => createOrStart(e, source)}
              disabled={source.running ? true : false}
            >
              {source.running
                ? "Running"
                : source.initialized
                ? "Start"
                : "Initialize"}
            </Button>
          }
        </S.DataItem>
        <S.DataItem headerItem={false} size={"small"}>
          <Button onClick={() => stopOrDelete(source)}>
            {source.running ? "Stop" : "Delete"}
          </Button>
        </S.DataItem>
        <S.DataItem headerItem={false} size={"small"}>
          <Button
            onClick={() => subscribeToSource(source.topic)}
            disabled={!source.running ? true : false}
          >
            Subscribe
          </Button>
        </S.DataItem>
      </T.Notification>
      {showInfo && (
        <S.InfoRow>
          <S.InfoColumn>
            <div>Name: {source.name}</div>
            <div>Type: {source.type}</div>
            <div>{source.topic ? "Topic: " + source.topic : ""}</div>
            {source.channels.length > 0 && <div>Channels:</div>}
            {source.channels.map((channel: string, index: number) => {
              return <div key={index}>{channel}</div>;
            })}
          </S.InfoColumn>
          <S.InfoColumn>
            {source.type === "processor" && (
              <div>
                <div>Processor type: {source.blueprint_id}</div>
                <div>Processor dir: {source.processor_dir}</div>
                <div>Byte format: {source.byte_format}</div>
                <div>Source topic: {source.source_topic}</div>
                <div>Source format: {source.source_format}</div>
                <div>input refs: {source.input_refs}</div>
                <div>output refs: {source.output_refs}</div>
                <div>Initiation Parameters: </div>
                {Object.entries(source.init_params).map(
                  (param: any, index: number) => {
                    if (param[0] === "inputs" || param[0] === "outputs") {
                      return;
                    }
                    let key = param[0];
                    let value = param[1];
                    return (
                      <div key={index}>
                        {key}: {value}
                      </div>
                    );
                  }
                )}
                <div>OUTPUTS: </div>
                {source.output_names !== undefined &&
                  source.output_names.map((output: string, index: number) => {
                    return <div key={index}>{output}</div>;
                  })}
              </div>
            )}
          </S.InfoColumn>
          <S.InfoColumn
            style={{
              justifyContent: "center",
            }}
          >
            <Button onClick={() => editSource(source)}>Edit</Button>
          </S.InfoColumn>
        </S.InfoRow>
      )}
    </div>
  );
};
export default Datasource;
