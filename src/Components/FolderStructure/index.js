import React, { memo, useState } from "react";
import { a, useSpring } from "react-spring";

import { useMeasure, usePrevious } from "./helpers";
import * as Icons from "./icons";
import { Content, Folder, FolderWrapper, Frame, Title, toggle } from "./styles";

const Tree = memo(({ children, name, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [bind, { height: viewHeight }] = useMeasure();
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    },
  });
  const Icon =
    Icons[`${children ? (isOpen ? "Minus" : "Plus") : "Close"}SquareO`];
  return (
    <Frame>
      <Icon
        style={{ ...toggle, opacity: children ? 1 : 0.3 }}
        onClick={() => setOpen(!isOpen)}
      />
      <Title style={style}>{name}</Title>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? "auto" : height,
        }}
      >
        <a.div style={{ transform }} {...bind} children={children} />
      </Content>
    </Frame>
  );
});

const FolderStructure = () => (
  <FolderWrapper>
    <Folder>
      <Tree name="your_file.fmu" defaultOpen>
        <Tree name="binaries">
          <Tree name="win64">
            <Tree name="Aerodyn.dll" style={{ color: "#37ceff" }} />
            <Tree name="Control.dll" style={{ color: "#37ceff" }} />
            <Tree name="..." style={{ color: "#37ceff" }} />
          </Tree>
          <Tree name="hello" />
        </Tree>
        <Tree name="resources">
          <Tree name="link_DB">
            <Tree name="Part1" style={{ color: "#37ceff" }} />
            <Tree name="Part2" style={{ color: "#37ceff" }} />
            <Tree name="..." style={{ color: "#37ceff" }} />
            <Tree name="custom content">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 200,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    borderRadius: 5,
                  }}
                />
              </div>
            </Tree>
          </Tree>
          <Tree name="model">
            <Tree name="response.bak.fmm" style={{ color: "#37ceff" }} />
            <Tree name="eigval_0001" style={{ color: "#37ceff" }} />
            <Tree name="fedem_solver.fao" style={{ color: "#37ceff" }} />
            <Tree name="custom content">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 200,
                  padding: 10,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "black",
                    borderRadius: 5,
                  }}
                />
              </div>
            </Tree>
          </Tree>
          <Tree name="config.txt"></Tree>
        </Tree>
        <Tree name="modeldescription.xml" />
      </Tree>
    </Folder>
  </FolderWrapper>
);

export default FolderStructure;
