// src/components/charts/DefaultRateChart.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DefaultRateChart = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from the API
    // For now, we'll generate some sample time series data
    const sampleData = [
      { month: "Jan", default_rate: 18.2 },
      { month: "Feb", default_rate: 19.1 },
      { month: "Mar", default_rate: 20.5 },
      { month: "Apr", default_rate: 22.3 },
      { month: "May", default_rate: 21.8 },
      { month: "Jun", default_rate: 20.4 },
      { month: "Jul", default_rate: 19.7 },
      { month: "Aug", default_rate: 18.9 },
      { month: "Sep", default_rate: 21.2 },
      { month: "Oct", default_rate: 22.5 },
      { month: "Nov", default_rate: 23.1 },
      { month: "Dec", default_rate: 21.7 },
    ];

    setData(sampleData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading || !data.length) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 550;
    const height = 300;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create chart group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.default_rate) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Add grid lines (IBCS-compliant)
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .style("stroke", "rgba(255, 255, 255, 0.1)");

    // Add line path
    const line = d3
      .line()
      .x((d) => x(d.month) + x.bandwidth() / 2)
      .y((d) => y(d.default_rate))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#dc3545") // Bootstrap danger color
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add data points
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.month) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.default_rate))
      .attr("r", 4)
      .attr("fill", "#dc3545")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6).attr("fill", "#bb2d3b");

        // Add tooltip
        g.append("rect")
          .attr("class", "tooltip-bg")
          .attr("x", x(d.month) + x.bandwidth() / 2 - 35)
          .attr("y", y(d.default_rate) - 30)
          .attr("width", 70)
          .attr("height", 20)
          .attr("fill", "#343a40")
          .attr("rx", 3);

        g.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.month) + x.bandwidth() / 2)
          .attr("y", y(d.default_rate) - 15)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "11px")
          .text(`${d.default_rate.toFixed(1)}%`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", "#dc3545");
        g.selectAll(".tooltip, .tooltip-bg").remove();
      });

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "#adb5bd")
      .style("font-size", "10px");

    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickFormat((d) => `${d}%`)
      )
      .selectAll("text")
      .style("fill", "#adb5bd")
      .style("font-size", "10px");

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Default Rate by Month");

    // Add axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Month");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Default Rate (%)");
  }, [data, loading]);

  if (loading) {
    return <div className="text-center">Loading chart...</div>;
  }

  return (
    <div className="default-rate-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default DefaultRateChart;
