import React, { useState } from "react"; 
import ProjectionView from "./ProjectionView";
import AxisView from "./AxisView";
import LegendView from "./LegendView";

const MainPlot = (props) => {
	const [ axesTheta, setAxesTheta ] = useState(props.attr.map((d, i) => 2 * Math.PI * i / props.attr.length));
	const [ checkViz, setCheckViz ] = useState(false);

	return (
		<div className="mainPlot">
			<ProjectionView
				axesTheta={axesTheta}
				checkViz={checkViz}
				setCheckViz={setCheckViz}
				raw={props.raw}
			/>
			<div className="subView">
				<AxisView
					axesTheta={axesTheta}
					setAxesTheta={setAxesTheta}
					setCheckViz={setCheckViz}
					attr={props.attr}
				/>
				<LegendView/>
			</div>
		</div>
	);
};

export default MainPlot;