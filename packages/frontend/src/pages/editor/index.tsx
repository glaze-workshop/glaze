import React, { FC, memo } from "react";
import Center from "./components/Center";
import LeftBar from "./components/LeftBar";
import RightBar from "./components/RightBar";
import TopNav from "./components/TopNav";

const Editor: FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-grow h-full">
        <LeftBar />
        <div className="flex-grow overflow-hidden flex items-stretch">
          <Center />
        </div>
        <RightBar />
      </div>
    </div>
  );
};

export default memo(Editor);
