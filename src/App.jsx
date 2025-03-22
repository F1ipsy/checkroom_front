import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu.jsx";
import ClothesStage from "./components/stages/ClothesStage.jsx";
import MakeupStage from "./components/stages/MakeupStage.jsx"
import JewelryStage from "@/components/stages/JewelryStage.jsx";

export default function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={<Menu />}
			/>
			<Route
				path='/category/:categoryId'
				element={<ClothesStage />}
			/>
			<Route
				path='/category/:categoryId/makeup'
				element={<MakeupStage />}
			/>
			<Route
				path='/category/:categoryId/jewelry'
				element={<JewelryStage />}
			/>
		</Routes>
	);
}
