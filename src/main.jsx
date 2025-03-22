import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<DndProvider options={HTML5toTouch}>
			<App />
		</DndProvider>
	</BrowserRouter>
);