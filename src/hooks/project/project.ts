import { useState } from "react";
import { EventTriggerParams } from "src/types/datahandling";
import {
  getEventTriggerList,
  newEventTrigger
} from "src/backendAPI/eventtrigger";

export const useEventTriggers = () => {
  const [loadingEventTrigger, setLoadingEventTrigger] = useState(false);
  const [error, setError] = useState("");
  const [triggers, setTriggers] = useState([] as any[]);

  const deleteEventTrigger = async (
    projectId: string,
    eventTriggerId: string
  ) => {
    setLoadingEventTrigger(true);
    try {
      setError("");
      const response = await deleteEventTrigger(projectId, eventTriggerId);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoadingEventTrigger(false);
    }
  };

  const getEventTriggers = async (projectId: string) => {
    setLoadingEventTrigger(true);
    try {
      const tempTriggers = await getEventTriggerList(projectId);
      const triggerList = tempTriggers.map((trigger: any) => {
        return {
          id: trigger.id,
          init_params: JSON.parse(trigger.init_params),
          topic_id: trigger.topic_id
        };
      });
      setTriggers(triggerList);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoadingEventTrigger(false);
    }
  };

  const createEventTrigger = async (
    projectId: string,
    trigger_id: string,
    topic_id: string,
    init_params: EventTriggerParams
  ) => {
    setLoadingEventTrigger(true);
    try {
      await newEventTrigger(projectId, trigger_id, topic_id, init_params).catch(
        error => {
          setError(error.toString());
        }
      );
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoadingEventTrigger(false);
    }
  };

  return {
    error,
    createEventTrigger,
    loadingEventTrigger,
    getEventTriggers,
    deleteEventTrigger,
    triggers
  };
};
