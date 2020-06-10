import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import useInvitesStore from "src/stores/listeners/invitesStore";
import { User } from "src/types/project";

import Button from "../UI/Button/Button";

interface Props {
  user: User | undefined;
}

export default function Invite(props: Props) {
  const { user } = props;

  const history = useHistory();

  const {
    acceptInvite,
    invites,
    listenToInvites,
    newInvite,
    loadingInvite,
  } = useInvitesStore((state) => ({
    acceptInvite: state.acceptInvite,
    invites: state.invites,
    newInvite: state.newInvite,
    listenToInvites: state.initializeInvites,
    loadingInvite: state.loadingInvite,
  }));

  useEffect(() => {
    if (user && user.email) {
      listenToInvites(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (newInvite && user) {
      toast.info(
        () => (
          <div>
            <div>New invite to project: {newInvite}</div>
            <div style={{ display: "flex" }}>
              <Button onClick={showInvite}>Show invite</Button>
              <Button
                loading={loadingInvite}
                onClick={() => acceptInvite(newInvite, user, history)}
              >
                Accept
              </Button>
              <Button onClick={() => {}}>Ignore</Button>
            </div>
          </div>
        ),
        { position: toast.POSITION.TOP_CENTER }
      );
    }
  }, [newInvite]);

  const showInvite = () => history.push("/projects");

  return <div style={{ height: "0px" }}></div>;
}
