import styled from "styled-components";

export const Container = styled.div``;
export const Columns = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Select = styled.div<{ isDragging: boolean }>`
  background-color: ${(p) => (p.isDragging ? "#efefef" : "white")};
  width: 350px;
  margin: 3px 0px;
  padding: 3px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ae8282;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Selected = styled.div<{ isDragging: boolean }>`
  background-color: lightgrey;
  background-color: ${(p) => (p.isDragging ? "#efefef" : "white")};
  width: 350px;
  margin: 3px 0px;
  padding: 3px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #1e91e2;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ColumnLeft = styled.div<{ isDraggingOver?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
  background-color: ${(p) => (p.isDraggingOver ? "#efefef" : "#f3f3f3")};
  padding-right: 50px;
  align-items: flex-end;
`;

export const ColumnRight = styled.div<{ isDraggingOver?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: flex-start;

  background-color: ${(p) => (p.isDraggingOver ? "#f3f3f3" : "white")};
  flex-direction: column;
  padding-left: 50px;
`;

export const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  max-width: 300px;
`;

export const Flex = styled.div`
  display: flex;
`;
