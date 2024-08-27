import React from "react";
import { ContainerComponent, SceneComponent } from "shared/components";

export const HumanComponent: React.FC = () => {
  return (
    <ContainerComponent>
      <SceneComponent
        size={{ width: 3, height: 0, depth: 3 }}
        scale={2}
      ></SceneComponent>
    </ContainerComponent>
  );
};
