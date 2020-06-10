import React from "react";

import * as S from "./TextInput.style";

interface Props {
  onChange?: (e: any) => void;
  placeholder?: string;
  value?: string | number;
  type?: string;
  id?: string;
  accept?: string;
  multiple?: boolean;
  defaultValue?: any;
  name?: string;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}

export default function TextInput(props: Props) {
  const {
    onChange,
    placeholder,
    value,
    type,
    accept,
    defaultValue,
    id,
    multiple,
    disabled,
    name,
    className,
    maxLength,
  } = props;
  return (
    <S.Input
      className={className}
      onChange={onChange}
      defaultValue={defaultValue}
      type={type}
      placeholder={placeholder}
      value={value}
      accept={accept}
      id={id}
      multiple={multiple}
      name={name}
      disabled={disabled}
      maxLength={maxLength}
    />
  );
}
