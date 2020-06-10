import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  margin: auto;
  padding: 0 40px;
`;

export const DataItem = styled.div<{
  headerItem: boolean;
  size?: string;
  color?: string;
}>`
    width: ${(p) => (p.size === "small" ? "120px" : "200px")};
    font-weight: ${(p) => (p.headerItem ? "700" : "initial")};
    font-size: ${(p) => (p.headerItem ? "13px" : "13px")};
    padding-bottom:  ${(p) => (p.headerItem ? "10px" : "0px")}
    margin-bottom: ${(p) => (p.headerItem ? "10px" : "0px")};
    color: ${(p) => (!p.headerItem && p.color ? p.color : "")};
  `;

export const InfoRow = styled.div`
  margin: auto;
  background-color: lightgrey;
  display: flex;
  flex-direction: row;
  padding: 10px;
`;

export const InfoColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Flex = styled.div`
  display: flex;
  margin-left: 40px;
  margin-bottom: 20px;
`;
