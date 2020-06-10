import React from "react";
import { startDatasource, subscribeToDatasource, useDatasources } from "src/backendAPI/datasources";
import { fetchTopics } from "src/backendAPI/topics";
import { Select } from "src/Components/UI/Dropdown/Dropdown.style";

import * as S from "../NewProject.style";

interface Props {
  setDataSource: (source: string) => void;
}

export default function UseExistingDatasource(props: Props) {
  const { setDataSource } = props;

  const { loading, datasources } = useDatasources();

  const handleSelectChange = (e: any) => {
    let source = e.target.value;
    startDatasource(source).then((r) => {
      fetchTopics().then((resp) => {
        subscribeToDatasource(source)
          .then((resp) => {
            setDataSource(source);
          })
          .catch((error) => {
            return error.text;
          });
      });
    });
  };

  return (
    <S.Columns>
      <S.ColumnLeft>
        <S.SmallText>Choose a datasource</S.SmallText>
      </S.ColumnLeft>
      <S.ColumnRight>
        {loading && <div>Getting datasources</div>}
        <Select onChange={handleSelectChange}>
          <option>none</option>
          {datasources &&
            datasources.map((source) => {
              return <option key={source}>{source}</option>;
            })}
        </Select>
      </S.ColumnRight>
    </S.Columns>
  );
}
