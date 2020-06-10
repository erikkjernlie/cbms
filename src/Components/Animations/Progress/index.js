import { render } from "react-dom";
import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import useMeasure from "./useMeasure";
import "./styles.css";

const Progress = (p) => {
  const { value } = p;
  const [open, toggle] = useState(false);
  const props = useSpring({ width: open ? value * 1.7 : 0 });

  useEffect(() => {
    toggle(true);
  }, []);

  return (
    <div className="main">
      <animated.div className="fill" style={props} />
      <animated.div className="content">{value}</animated.div>
    </div>
  );
};

export default Progress;
