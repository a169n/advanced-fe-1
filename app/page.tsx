import App from "../components/App";
import { BoardProvider } from "../context/BoardContext";

export default function HomePage() {
  return (
    <BoardProvider>
      <App />
    </BoardProvider>
  );
}
