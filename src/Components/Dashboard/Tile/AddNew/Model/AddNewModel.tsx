import React from "react";
import * as S from "src/Components/Dashboard/Dashboard.style";
import CreateNewModel from "src/Components/Model/CreateNewModel";

interface Props {
  projectId: string;
}

const AddNewModel = (props: Props) => {
  const { projectId } = props;
  return (
    <S.AddNewComponentContainer>
      <CreateNewModel projectId={projectId} />
    </S.AddNewComponentContainer>
  );
};

export default AddNewModel;
