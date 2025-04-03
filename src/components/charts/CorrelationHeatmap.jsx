// src/components/charts/CorrelationHeatmap.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const CorrelationHeatmap = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from the API
    // For now, we'll generate some sample correlation data
    const sampleData = [
      {
        feature: "person_age",
        values: [
          { feature: "person_age", correlation: 1.0 },
          { feature: "person_income", correlation: 0.35 },
          { feature: "loan_amnt", correlation: 0.22 },
          { feature: "loan_int_rate", correlation: -0.12 },
          { feature: "loan_status", correlation: -0.18 },
        ],
      },
      {
        feature: "person_income",
        values: [
          { feature: "person_age", correlation: 0.35 },
          { feature: "person_income", correlation: 1.0 },
          { feature: "loan_amnt", correlation: 0.57 },
          { feature: "loan_int_rate", correlation: -0.05 },
          { feature: "loan_status", correlation: -0.29 },
        ],
      },
      {
        feature: "loan_amnt",
        values: [
          { feature: "person_age", correlation: 0.22 },
          { feature: "person_income", correlation: 0.57 },
          { feature: "loan_amnt", correlation: 1.0 },
          { feature: "loan_int_rate", correlation: 0.31 },
          { feature: "loan_status", correlation: 0.14 },
        ],
      },
      {
        feature: "loan_int_rate",
        values: [
          { feature: "person_age", correlation: -0.12 },
          { feature: "person_income", correlation: -0.05 },
          { feature: "loan_amnt", correlation: 0.31 },
          { feature: "loan_int_rate", correlation: 1.0 },
          { feature: "loan_status", correlation: 0.42 },
        ],
      },
      {
        feature: "loan_status",
        values: [
          { feature: "person_age", correlation: -0.18 },
          { feature: "person_income", correlation: -0.29 },
          { feature: "loan_amnt", correlation: 0.14 },
          { feature: "loan_int_rate", correlation: 0.42 },
          { feature: "loan_status", correlation: 1.0 },
        ],
      },
    ];

    setData(sampleData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading || !data.length) return;

    const margin = { top: 50, right: 50, bottom: 50, left: 90 };
    const width = 550;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear any existing chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Extract features for axes
    const features = data.map((d) => d.feature);

    // Create scales
    const x = d3
      .scaleBand()
      .domain(features)
      .range([margin.left, margin.left + innerWidth])
      .padding(0.05);

    const y = d3
      .scaleBand()
      .domain(features)
      .range([margin.top, margin.top + innerHeight])
      .padding(0.05);

    // Create color scale (diverging, for correlations from -1 to 1)
    const color = d3
      .scaleSequential()
      .domain([-1, 1])
      .interpolator(d3.interpolateRdBu);

    // Add cells
    data.forEach((row) => {
      row.values.forEach((cell) => {
        svg
          .append("rect")
          .attr("x", x(cell.feature))
          .attr("y", y(row.feature))
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", color(cell.correlation))
          .attr("stroke", "#1a1a1a")
          .attr("stroke-width", 1)
          .on("mouseover", function (event) {
            // Highlight on hover
            d3.select(this).attr("stroke", "white").attr("stroke-width", 2);

            // Add tooltip
            const tooltip = svg.append("g").attr("class", "tooltip");

            tooltip
              .append("rect")
              .attr("x", x(cell.feature) + x.bandwidth() / 2 - 80)
              .attr("y", y(row.feature) - 40)
              .attr("width", 160)
              .attr("height", 30)
              .attr("fill", "#343a40")
              .attr("stroke", "#495057")
              .attr("rx", 5);

            tooltip
              .append("text")
              .attr("x", x(cell.feature) + x.bandwidth() / 2)
              .attr("y", y(row.feature) - 20)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .attr("fill", "white")
              .style("font-size", "12px")
              .text(
                `${row.feature} vs ${cell.feature}: ${cell.correlation.toFixed(
                  2
                )}`
              );
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke", "#1a1a1a").attr("stroke-width", 1);

            svg.selectAll(".tooltip").remove();
          });

        // Add text for correlation values
        svg
          .append("text")
          .attr("x", x(cell.feature) + x.bandwidth() / 2)
          .attr("y", y(row.feature) + y.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", Math.abs(cell.correlation) > 0.5 ? "white" : "black")
          .style("font-size", "10px")
          .text(cell.correlation.toFixed(2));
      });
    });

    // Add x-axis labels
    svg
      .selectAll(".x-axis-label")
      .data(features)
      .enter()
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", (d) => x(d) + x.bandwidth() / 2)
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#adb5bd")
      .style("font-size", "10px")
      .text((d) => d);

    // Add y-axis labels
    svg
      .selectAll(".y-axis-label")
      .data(features)
      .enter()
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", margin.left - 5)
      .attr("y", (d) => y(d) + y.bandwidth() / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#adb5bd")
      .style("font-size", "10px")
      .text((d) => d);

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Feature Correlation Matrix");

    // Add legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = margin.left + (innerWidth - legendWidth) / 2;
    const legendY = height - 20;

    // Create gradient for legend
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "correlation-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    linearGradient
      .selectAll("stop")
      .data([
        { offset: "0%", color: color(-1) },
        { offset: "50%", color: color(0) },
        { offset: "100%", color: color(1) },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    // Add legend rectangle
    svg
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#correlation-gradient)");

    // Add legend labels
    svg
      .append("text")
      .attr("x", legendX)
      .attr("y", legendY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#adb5bd")
      .style("font-size", "9px")
      .text("-1");

    svg
      .append("text")
      .attr("x", legendX + legendWidth / 2)
      .attr("y", legendY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#adb5bd")
      .style("font-size", "9px")
      .text("0");

    svg
      .append("text")
      .attr("x", legendX + legendWidth)
      .attr("y", legendY - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#adb5bd")
      .style("font-size", "9px")
      .text("1");
  }, [data, loading]);

  if (loading) {
    return <div className="text-center">Loading chart...</div>;
  }

  return (
    <div className="correlation-heatmap">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CorrelationHeatmap;
