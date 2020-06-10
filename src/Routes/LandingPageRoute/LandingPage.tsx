import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ImageSlider from "src/Components/ImageSlider/ImageSlider";
import { Button } from "src/Components/UI/Button/Button.style";
import { useUser } from "src/hooks/authentication/authentication";
import useProjectStore from "src/stores/project/projectStore";

import * as S from "./LandingPage.style";

import "src/utils/styles/styles.css";

export default function LandingPage() {
  const history = useHistory();

  const setProject = useProjectStore((state) => state.setProject);

  const { user } = useUser();

  useEffect(() => {
    setProject("");
  }, []);

  return (
    <div>
      <S.Background></S.Background>

      <S.SectionLight>
        <S.Content>
          <S.Title>What is the Cloud-Based Monitoring System?</S.Title>
          <S.Description>
            The development of digital twin platforms for monitoring and
            predictive maintenance is a complex process, as it requires
            extensive knowledge about information, communication and sensor
            technologies, and expertise within the application domain. Most of
            these platforms are based on expensive proprietary formats, and are
            not applicable to academia and SME companies. At NTNU, there is an
            ongoing project at the Department of Mechanical and Industrial
            Engineering that aims to develop a cloud-based monitoring system
            (CBMS) for digital twins. The project is developed in multiple
            iterations by students at the department.
          </S.Description>
        </S.Content>
      </S.SectionLight>
      <S.SectionDark>
        <S.Content>
          <S.Video>
            <iframe
              style={{
                width: "100%",
                position: "relative",
                height: "450px",
              }}
              src={"https://www.youtube.com/embed/Y9iiNdrHbEQ"}
              frameBorder="0"
            />
          </S.Video>
        </S.Content>
      </S.SectionDark>
      <S.SectionLight>
        <S.Content>
          <S.Title>How does it work?</S.Title>
          <ImageSlider />
        </S.Content>
      </S.SectionLight>
      <S.SectionDark>
        <S.Content>
          <S.Title>Get started</S.Title>
          <S.Description>Sign up or login, it's free to use.</S.Description>
          <Button
            className="Big"
            onClick={() => {
              if (user) {
                history.push("/projects");
              } else {
                history.push("/signin");
              }
            }}
          >
            Get started
          </Button>
        </S.Content>
      </S.SectionDark>
    </div>
  );
}
