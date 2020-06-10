import React, { SyntheticEvent, useEffect, useState } from "react";
import { deleteDatasource, startDatasource, stopDatasource } from "src/backendAPI/datasources";
import { createProcessor, deleteProcessor, stopProcessor } from "src/backendAPI/processors";
import { fetchTopics } from "src/backendAPI/topics";
import * as T from "src/Components/Notifications/Notification.style";
import Button from "src/Components/UI/Button/Button";
import { Datasource, RawTopic, Topic, TopicsJson } from "src/types/datasource";
import { makeChannels } from "src/utils/dataHandler/channelParser";
import { useProcessorStarter } from "src/utils/processorHandler/processorStarter";
import TransformData from "src/utils/processorHandler/TransformData";

import useDatasourceStore from "../../stores/project/datasourceStore";
import CreateDatasourceModal from "./CreateDatasourceModal";
import DatasourceComponent from "./Datasource";
import * as S from "./Datasources.style";

interface Props {
  projectId: string;
}

export default function Datasources(props: Props) {
  const { projectId } = props;

  const [topics, setTopics] = useState([] as Topic[]);
  const [addSource, setAddSource] = useState(false);
  const [createDatasource, setCreateDatasource] = useState(false);
  const [edit, setEdit] = useState(false);
  const [source, setSource] = useState({} as Datasource);
  const [error, setError] = useState("");

  const { createProcessorFormData, startProcessor } = useProcessorStarter();
  const {
    deleteSourceFromDatabase,
    fetchSourcesFromDatabase,
    sourceList,
  } = useDatasourceStore();

  useEffect(() => {
    if (projectId !== undefined) {
      fetchSourcesFromDatabase(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    loadTopics();
  }, [sourceList]);

  // Fetching topics from server
  const loadTopics = async () => {
    const topicsJSON = (await fetchTopics()) as TopicsJson;
    if (!topicsJSON) {
      setError("Could not load data sources");
      return;
    }
    let topics = Object.entries(topicsJSON).map((tempTopic: any) => {
      let id = tempTopic[0];
      let topic = tempTopic[1] as RawTopic;
      return {
        id: id,
        url: topic.url,
        byteFormat: topic.byte_format,
        channels: makeChannels(topic) || [],
      } as Topic;
    });
    setTopics(topics);
  };

  // Creating or starting datasource or processor depending on the status of the source
  const createOrStartSource = (e: SyntheticEvent, source: Datasource) => {
    e.preventDefault();
    source.type === "datasource"
      ? startDatasource(source.name).then(() => {
          fetchSourcesFromDatabase(projectId);
        })
      : !source.initialized
      ? initializeProcessor(source).then(() => {
          fetchSourcesFromDatabase(projectId);
        })
      : startProcessor(
          {
            inputs: source.init_params.inputs,
            outputs: source.init_params.outputs,
          },
          source.start_params,
          source.name
        ).then(() => {
          fetchSourcesFromDatabase(projectId);
        });
  };

  // Initializing processor, called in createOrStartSource
  const initializeProcessor = async (source: Datasource) => {
    if (
      source.name.length > 0 &&
      source.blueprint_id &&
      source.init_params &&
      source.source_topic
    ) {
      const formData = createProcessorFormData(
        source.name,
        source.blueprint_id,
        source.init_params,
        source.source_topic
      );

      try {
        await createProcessor(formData);
      } catch (error) {
        setError(error.text);
      }
    } else {
      setError("Missing information. Cannot create");
    }
  };

  // Stopping or deleting datasource or processor depending on the status of the source
  const stopOrDeleteSource = (source: Datasource) => {
    if (source.type === "datasource") {
      source.running
        ? stopDatasource(source.name).then(() => {
            fetchSourcesFromDatabase(projectId);
          })
        : deleteDatasource(source.name).then(() => {
            deleteSourceFromDatabase(projectId, source.id);
            fetchSourcesFromDatabase(projectId);
          });
    } else {
      source.running
        ? stopProcessor(source.name).then(() => {
            fetchSourcesFromDatabase(projectId);
          })
        : deleteProcessor(source.name).then(() => {
            deleteSourceFromDatabase(projectId, source.id);
            fetchSourcesFromDatabase(projectId);
          });
    }
  };

  // Closing modal (create processor)
  const closeModalTransform = () => {
    setAddSource(!addSource);
  };

  const closeModalCreateDatasource = () => {
    setCreateDatasource(!createDatasource);
  };

  // Opening modal (edit existing processor)
  const editSource = (source: Datasource) => {
    setSource(source);
    setAddSource(true);
    setEdit(true);
  };

  return (
    <div>
      <S.Flex>
        <Button className="Blue" onClick={() => setCreateDatasource(true)}>
          Create New Datasource
        </Button>
        <Button className="Black" onClick={() => setAddSource(true)}>
          Add Filter to Datasource
        </Button>
      </S.Flex>
      <T.Notifications>
        <T.Container headerItem={true}>
          <T.Notification headerItem={true}>
            <S.DataItem headerItem={true} size={"large"}>
              Name
            </S.DataItem>
            <S.DataItem headerItem={true} size={"large"}>
              Type
            </S.DataItem>
            <S.DataItem headerItem={true} size={"small"}>
              Status
            </S.DataItem>
            <S.DataItem headerItem={true} size={"small"}>
              Topic
            </S.DataItem>
            <S.DataItem headerItem={true} size={"small"}>
              Initialize or Start
            </S.DataItem>
            <S.DataItem headerItem={true} size={"small"}>
              Stop or Delete
            </S.DataItem>
            <S.DataItem headerItem={true} size={"small"}>
              Subscribe
            </S.DataItem>
          </T.Notification>
        </T.Container>
      </T.Notifications>
      <T.Bar />
      {sourceList && (
        <T.Notifications>
          {sourceList.map((src: Datasource, index: number) => {
            return (
              <DatasourceComponent
                key={index}
                source={src}
                createOrStart={createOrStartSource}
                stopOrDelete={stopOrDeleteSource}
                editSource={editSource}
              />
            );
          })}
        </T.Notifications>
      )}

      {addSource && (
        <TransformData
          isOpen={addSource}
          toggleModal={closeModalTransform}
          propTopics={topics}
          source={source}
          edit={edit}
          projectId={projectId}
        />
      )}
      {createDatasource && (
        <CreateDatasourceModal
          isOpen={createDatasource}
          toggleModal={closeModalCreateDatasource}
          projectId={projectId}
        />
      )}
    </div>
  );
}
