import React from "react";
import { ClipLoader } from "react-spinners";

import * as S from "./Dropdown.style";

interface Props {
  children: React.ReactNode;
  onChange?: (e: any) => void;
  loading?: boolean;
  className?: string;
}

export default function SelectComponent(props: Props) {
  const { children, className, onChange, loading } = props;

  if (loading) {
    // return loading icon here later
    return (
      <div>
        <ClipLoader
          size={15}
          //size={"150px"} this also works
          color={"#123abc"}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <S.Select className={className} onChange={onChange}>
      {children}
    </S.Select>
  );
}
