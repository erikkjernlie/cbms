import styled from "styled-components";

export const Container = styled.div``;
export const Columns = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

export const ColumnRight = styled.div<{ noPadding?: boolean }>`
  padding: ${(p) => (p.noPadding ? "0px" : "30px")} 0px;
  display: flex;
  flex: 1;
  justify-content: flex-start;
  flex-direction: column;
  padding-left: 50px;
`;
export const ColumnLeft = styled.div<{ noPadding?: boolean }>`
  padding: ${(p) => (p.noPadding ? "0px" : "30px")} 0px;
  font-size: 14px;
  display: flex;
  flex: 1;
  justify-content: flex-end;
  background-color: #f3f3f3;
  padding-right: 50px;
`;
export const Title = styled.h2`
  color: #141a21;
  margin: 10px;
  margin-bottom: 30px;
  margin-top: 30px;
  text-align: center;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: auto;
  width: 100%;
`;

export const MediumTitle = styled.div`
  color: #141a21;
  margin: 10px;
  font-size: 24px;
  font-weight: 600;
  max-width: 500px;
  margin-bottom: 30px;
  margin-top: 30px;
  text-align: center;
`;
export const Description = styled.div`
  font-size: 15px;
  margin-bottom: 15px;
`;

export const CenterContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  min-height: 400px;
`;

export const Bar = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
`;

export const Text = styled.div`
  max-width: 400px;
`;

export const Flex = styled.div`
  display: flex;
`;

export const NumberCircle = styled.div`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  padding-bottom: 3px;
  background: none;
  border: 3px solid white;
  color: white;
  text-align: center;

  font: 14px;
`;
export const UserHeader = styled.div`
  width: 100%;
  padding: 10px 20px;
  color: white;
  background: linear-gradient(135deg, #141a21, #141a21 60%, #1e91e2);
  display: flex;
  align-items: center;
`;

export const Info = styled.div`
  margin-bottom: 10px;
  padding: 0 20px;
`;

export const BarLine = styled.div`
  height: 2px;
  border: 1px solid #007aaa14;
  width: 400px;
`;

export const SubDescription = styled.div`
  font-size: 10px;
`;

export const FMUFormat = styled.div``;

export const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  max-width: 300px;
`;

export const UploadFile = styled.div`
  margin-top: 20px;
`;

export const Generating = styled.div`
  margin-top: 20px;
  margin-left: 10px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Label = styled.label`
  width: 50%;
`;
export const Input = styled.input`
  width: 40%;
`;
