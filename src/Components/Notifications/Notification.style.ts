import styled from "styled-components";

export const Notification = styled.div<{ headerItem: boolean }>`
  display: flex;
  justify-content: space-between;
`;

export const Notifications = styled.div`
  padding: 0 40px;
`;

export const Flex = styled.div`
  display: flex;
  margin-left: 40px;
`;

export const Center = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const EventTrigger = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 5px;
`;

export const TriggerItem = styled.div<{ button?: boolean }>`
  margin-left: ${(p) => (p.button ? "-14px" : "0px")};
`;
export const Bold = styled.span`
  font-weight: 500;
  margin-right: 2px;
`;
export const TriggerItemLabel = styled.div`
  font-size: 11px;
`;

export const Item = styled.div<{ headerItem: boolean; params?: boolean }>`
  width: ${(p) => (p.params ? "100%" : "200px")};
  font-weight: ${(p) => (p.headerItem ? "700" : "initial")};
  font-size: ${(p) => (p.headerItem ? "15px" : "13px")};
  padding-bottom:  ${(p) => (p.headerItem ? "10px" : "0px")}
  margin-bottom: ${(p) => (p.headerItem ? "10px" : "0px")};
  color: ${(p) => (!p.headerItem && p.color ? p.color : "")};
`;

export const Left = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const Bar = styled.div`
  border-bottom: 2px solid #ededed;
`;

export const NotificationItem = styled.div<{
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

export const Container = styled.div<{
  headerItem: boolean;
}>`
  margin: 10px;
  ${(p) => !p.headerItem && "border-bottom: 1px solid lightgrey"};
`;

export const Label = styled.div`
  font-weight: 700;
  font-size: 10px;
`;

export const Plot = styled.div<{ expanded: boolean }>`
  max-height: ${(p) => (p.expanded ? "600px" : "00px")};
  transition: max-height 0.5s ease-out; // note that we're transitioning max-height, not height!
  height: auto;
  overflow: hidden;
`;
