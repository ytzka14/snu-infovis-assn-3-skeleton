import React, { useRef, useEffect } from "react";
import { tnc } from "../tnc";
import { colormap } from "../colormap";
import * as d3 from "d3";

const ProjectionView = (props) => {
  // axesTheta, checkViz, setCheckViz, raw
  const svgRef = useRef(null);
  const size = 700;
  const margin = 15;

  const getCoord = (datum) => {
    let x = 0;
    let y = 0;
    for (let i = 0; i < datum.length; i++) {
      x += datum[i] * Math.cos(props.axesTheta[i]);
      y += datum[i] * Math.sin(props.axesTheta[i]);
    }
    return { x: x, y: y };
  };

  const projectedData = props.raw.map((d) => getCoord(d));

  const toPointString = (coords) => {
    let ret = "";
    for (let i = 0; i < coords.length - 1; i++) {
      ret = ret + String(coords[i][0]) + "," + String(coords[i][1]) + " ";
    }
    ret =
      ret +
      String(coords[coords.length - 1][0]) +
      "," +
      String(coords[coords.length - 1][1]);
    return ret;
  };

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("height", size + 2 * margin)
      .attr("width", size + 2 * margin);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(projectedData, (d) => d.x))
      .range([margin, margin + size]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(projectedData, (d) => d.y))
      .range([margin + size, margin]);

    if (props.checkViz) {
      const tncResult = tnc(
        props.raw,
        projectedData.map((d) => [xScale(d.x), yScale(d.y)])
      );
      const voronoi = d3.Delaunay.from(
        projectedData.map((d) => [xScale(d.x), yScale(d.y)])
      ).voronoi([margin, margin, margin + size, margin + size]);
      const tncData = tncResult.trust.map((e, i) => [
        e,
        tncResult.conti[i],
        voronoi.cellPolygon(i),
      ]); // [[trust, conti, voronoi], [trust, conti, voronoi], ...]

      svg
        .selectAll("polygon")
        .data(tncData)
        .enter()
        .append("polygon")
        .attr("points", (d) => toPointString(d[2]))
        .attr("fill", (d) => colormap(d[0], d[1]))
        .attr("stroke", "none")
        .attr("class", (d, i) => `voronoi-polygon vp${i}`);
    } else {
      svg.selectAll("polygon").remove();
    }

    const points = svg.selectAll("circle").data(projectedData);

    points
      .enter()
      .append("circle")
      .merge(points)
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 2)
      .attr("class", (d, i) => `circle c${i}`);

    return () => {
      svg.selectAll("*").remove();
    };
  }, [projectedData, props]);

  return (
    <div className="projectionView">
      <svg ref={svgRef} className="projectionSvg" />
      {props.checkViz && (
        <button onClick={() => props.setCheckViz(false)} className="vizButton">
          Disable CheckViz!!
        </button>
      )}
      {!props.checkViz && (
        <button onClick={() => props.setCheckViz(true)} className="vizButton">
          Enable CheckViz!!
        </button>
      )}
    </div>
  );
};

export default ProjectionView;
