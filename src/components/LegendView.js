import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { colormap } from "../colormap";

const LegendView = () => {
  const svgRef = useRef(null);

  const size = 150;
  const margin = 3;
  const fontSize = 11;

  const data = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      data.push([i, j]);
    }
  }

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("height", size)
      .attr("width", size);

    if (svg.selectAll(".rectGroup").empty()) {
      svg
        .append("g")
        .attr("class", "rectGroup")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("height", 1)
        .attr("width", 1)
        .attr("x", (d) => d[0])
        .attr("y", (d) => d[1])
        .attr("fill", (d) => colormap(1 - d[0] / size, d[1] / size));

      svg
        .append("text")
        .text("Missing Neighbors")
        .attr("fill", "white")
        .attr("font-size", fontSize)
        .attr("x", margin)
        .attr("y", margin)
        .attr("dominant-baseline", "text-before-edge")
        .attr("text-anchor", "start");

      svg
        .append("text")
        .text("Both")
        .attr("fill", "white")
        .attr("font-size", fontSize)
        .attr("x", size - margin)
        .attr("y", margin)
        .attr("dominant-baseline", "text-before-edge")
        .attr("text-anchor", "end");

      svg
        .append("text")
        .text("No Distortion")
        .attr("fill", "black")
        .attr("font-size", fontSize)
        .attr("x", margin)
        .attr("y", size - margin)
        .attr("dominant-baseline", "text-after-edge")
        .attr("text-anchor", "start");

      svg
        .append("text")
        .text("False Neighbors")
        .attr("fill", "white")
        .attr("font-size", fontSize)
        .attr("x", size - margin)
        .attr("y", size - margin)
        .attr("dominant-baseline", "text-after-edge")
        .attr("text-anchor", "end");
    }
  });

  return (
    <div className="legendView">
      <svg ref={svgRef} />
    </div>
  );
};

export default LegendView;
