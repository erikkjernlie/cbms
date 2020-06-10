import React, { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "src/Components/UI/Button/Button";
import TextInput from "src/Components/UI/TextInput/TextInput";
import * as S from "src/Routes/NewProjectRoute/NewProject.style";
import useProjectStore from "src/stores/project/projectStore";

interface Props {
  projectId: string;
}

export default function CreateNewDashboard(props: Props): React.ReactElement {
  const { projectId } = props;

  const [error, setError] = useState("");
  const [dashboardName, setDashboardName] = useState("");

  const history = useHistory();

  const { creating, createNewDashboard } = useProjectStore((state) => ({
    creating: state.fetching,
    createNewDashboard: state.createNewDashboard,
  }));

  const createDashboard = (e: SyntheticEvent) => {
    e.preventDefault();
    if (
      dashboardName.length > 0 &&
      dashboardName !== "new" &&
      !/\s/.test(dashboardName)
    ) {
      createNewDashboard(projectId, dashboardName, history);
    } else if (dashboardName === "new") {
      setError("Dashboard name cannot be named new");
    } else if (/\s/.test(dashboardName)) {
      setError("Dashboard name cannot contain spaces");
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={(e: SyntheticEvent) => createDashboard(e)}>
          <S.Title>Create a dashboard</S.Title>
          <S.Columns>
            <S.ColumnLeft>
              <S.SmallText>Choose a name for your dashboard</S.SmallText>
            </S.ColumnLeft>
            <S.ColumnRight>
              <TextInput
                onChange={(e) => {
                  setDashboardName(e.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                value={dashboardName}
              />
            </S.ColumnRight>
          </S.Columns>
          <S.Columns>
            <S.ColumnLeft>
              <S.SmallText>Create new dashboard</S.SmallText>
            </S.ColumnLeft>
            <S.ColumnRight>
              <Button type="submit" loading={creating} className="MediumBlue">
                Create
              </Button>
            </S.ColumnRight>
          </S.Columns>{" "}
        </form>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
