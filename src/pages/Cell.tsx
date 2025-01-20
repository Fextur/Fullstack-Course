import { Box } from "@mui/system";
import { Player } from "./MainPage";

interface CellProps {
  value: Player | null;
  onClick: () => void;
}
const Cell = (props: CellProps) => {
  return (
    <div
      onClick={props.onClick}
      style={{
        backgroundColor: "#f2f2f2",
        border: "2px solid #444",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "5rem",
        fontWeight: "bold",
        color: props.value === Player.X ? "red" : "blue",
        cursor: props.value === null ? "pointer" : "default",
        width: "100%",
        height: "100%",
      }}
    >
      {props.value}
    </div>
  );
};

export default Cell;
