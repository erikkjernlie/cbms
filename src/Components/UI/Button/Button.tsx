import React from "react";
import { ClipLoader } from "react-spinners";

import * as S from "./Button.style";

interface Props {
  children: React.ReactNode;
  onClick?: (e: any) => void;
  loading?: boolean;
  className?: string;
  type?: "submit" | "reset" | "button";
  form?: string;
  display?: "none" | "inline" | "block" | "inline-block" | undefined;
  disabled?: boolean;
  selected?: boolean;
}

export default function Button(props: Props) {
  const {
    children,
    disabled,
    className,
    onClick,
    loading,
    type,
    form,
    display,
    selected,
  } = props;

  return (
    <S.Button
      className={className}
      onClick={onClick}
      type={type}
      form={form}
      display={display}
      disabled={disabled}
      selected={selected}
    >
      {loading ? (
        <ClipLoader size={15} color={"#123abc"} loading={loading} />
      ) : (
        children
      )}
    </S.Button>
  );
}
