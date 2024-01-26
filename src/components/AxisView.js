import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const AxisView = (props) => {
  // axesTheta, setAxesTheta, setCheckViz, attr
  const svgRef = useRef(null);
  const size = 500;
  const margin = 15;
  const bigRadius = 150;
  const smallRadius = 10;
  const center = margin + size / 2;

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("height", size + 2 * margin)
      .attr("width", size + 2 * margin);

    if (svg.selectAll(".axisRadius").empty()) {
      svg
        .append("circle")
        .attr("cx", center)
        .attr("cy", center)
        .attr("r", bigRadius)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5")
        .attr("fill", "none")
        .attr("class", "axisRadius");
    }

    const groups = svg
      .selectAll(".dragGroup")
      .data(
        props.attr.map((d, i) => {
          return { attr: d, theta: props.axesTheta[i], index: i };
        })
      )
      .enter()
      .append("g")
      .attr("class", (d, i) => `dragGroup d${i}`);

    groups
      .append("path")
      .attr("d", (d) => {
        const path = d3.path();
        path.moveTo(center, center);
        path.lineTo(
          center + bigRadius * Math.cos(d.theta),
          center - bigRadius * Math.sin(d.theta)
        );
        return path;
      })
      .attr("class", (d, i) => `dragPath d${i}`);

    groups
      .append("circle")
      .attr("cx", (d) => center + bigRadius * Math.cos(d.theta))
      .attr("cy", (d) => center - bigRadius * Math.sin(d.theta))
      .attr("r", smallRadius)
      .attr("class", (d, i) => `dragCircle d${i}`)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            props.setCheckViz(false);
            svg.selectAll(`.d${d.index}`).raise().classed("active", true);
          })
          .on("drag", (event, d) => {
            d.theta = Math.atan((center - event.y) / (event.x - center));
            if (event.x < center) d.theta += Math.PI;
            else if (event.y > center) d.theta += 2 * Math.PI;
            console.log(d.theta);
            const newAxesTheta = props.axesTheta;
            newAxesTheta[d.index] = d.theta;
            props.setAxesTheta([...newAxesTheta]);

            svg
              .select(".dragCircle.active")
              .attr("cx", center + bigRadius * Math.cos(d.theta))
              .attr("cy", center - bigRadius * Math.sin(d.theta));
            svg.select(".dragPath.active").attr("d", () => {
              const path = d3.path();
              path.moveTo(center, center);
              path.lineTo(
                center + bigRadius * Math.cos(d.theta),
                center - bigRadius * Math.sin(d.theta)
              );
              return path;
            });
            svg
              .select(".dragText.active")
              .attr("x", center + (bigRadius + smallRadius) * Math.cos(d.theta))
              .attr("y", center - (bigRadius + smallRadius) * Math.sin(d.theta))
              .attr("dominant-baseline", () => {
                if (0 <= d.theta && d.theta <= Math.PI) {
                  return "text-after-edge";
                } else {
                  return "text-before-edge";
                }
              })
              .attr("text-anchor", () => {
                if (d.theta <= Math.PI / 2 || (Math.PI * 3) / 2 <= d.theta) {
                  return "start";
                } else {
                  return "end";
                }
              });
          })
          .on("end", (event, d) => {
            svg.selectAll(`.d${d.index}`).classed("active", false);
          })
      );

    groups
      .append("text")
      .text((d) => d.attr)
      .attr("x", (d) => center + (bigRadius + smallRadius) * Math.cos(d.theta))
      .attr("y", (d) => center - (bigRadius + smallRadius) * Math.sin(d.theta))
      .attr("dominant-baseline", (d) => {
        if (0 <= d.theta && d.theta <= Math.PI) {
          return "text-after-edge";
        } else {
          return "text-before-edge";
        }
      })
      .attr("text-anchor", (d) => {
        if (d.theta <= Math.PI / 2 || (Math.PI * 3) / 2 <= d.theta) {
          return "start";
        } else {
          return "end";
        }
      })
      .attr("class", (d, i) => `dragText d${i}`);
  }, [center, props]);

  return (
    <div className="axisView">
      <svg ref={svgRef} />
    </div>
  );
};

export default AxisView;
