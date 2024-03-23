import { useState } from "react";
import WheelComponent from "./WheelComponent";
import "./SpinnerWheel.css";

function Wheel({ candidateNamesArray }: { candidateNamesArray: string[] }) {
  const [winner, setWinner] = useState("");
  const segments = [...candidateNamesArray];
  const segColors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#FF9000"];

  const onFinished = (winner: string) => {
    setWinner(winner);
  };

  return (
    <>
      <div id="wheelCircle">
        <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment=""
          onFinished={(winner: string) => onFinished(winner)}
          primaryColor="black"
          primaryColoraround="#ffffffb4"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          size={190}
          upDuration={50}
          downDuration={1000}
        />
      </div>
      {winner && <h5>Winner is {winner}</h5>}
    </>
  );
}

export default Wheel;
