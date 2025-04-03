// src/components/charts/LoanGradeChart.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { dataMappings } from "../../api/creditRiskApi";

const LoanGradeChart = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from the API
    // For now, we'll generate some sample data
    const sampleData = [
      { grade: "A", default_rate: 5.3, total_loans: 4250 },
      { grade: "B", default_rate: 9.8, total_loans: 6120 },
      { grade: "C", default_rate: 15.6, total_loans: 8340 },
      { grade: "D", default_rate: 22.7, total_loans: 5670 },
      { grade: "E", default_rate: 31.9, total_loans: 3480 },
      { grade: "F", default_rate: 42.1, total_loans: 1950 },
      { grade: "G", default_rate: 55.8, total_loans: 920 },
    ];

    setData(sampleData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading || !data.length) return;

    const margin = { top: 20, right: 90, bottom: 40, left: 60 };
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
      .domain(data.map((d) => d.grade))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.default_rate) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Secondary y-axis for total loans
    const y2 = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.total_loans) * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Add grid lines (IBCS-compliant)
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .style("stroke", "rgba(255, 255, 255, 0.1)");

    // A color scale based on loan grade
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.grade))
      .range([
        "#198754",
        "#20c997",
        "#0dcaf0",
        "#0d6efd",
        "#ffc107",
        "#fd7e14",
        "#dc3545",
      ]);

    // Add bars for default rate
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.grade))
      .attr("y", (d) => y(d.default_rate))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.default_rate))
      .attr("fill", (d) => color(d.grade))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);

        // Add tooltip
        g.append("rect")
          .attr("class", "tooltip-bg")
          .attr("x", x(d.grade) + x.bandwidth() / 2 - 60)
          .attr("y", y(d.default_rate) - 40)
          .attr("width", 120)
          .attr("height", 35)
          .attr("fill", "#343a40")
          .attr("rx", 3);

        g.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.grade) + x.bandwidth() / 2)
          .attr("y", y(d.default_rate) - 25)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "11px")
          .text(`Grade ${d.grade}: ${d.default_rate.toFixed(1)}%`);

        g.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.grade) + x.bandwidth() / 2)
          .attr("y", y(d.default_rate) - 10)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .style("font-size", "11px")
          .text(`${d.total_loans.toLocaleString()} loans`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        g.selectAll(".tooltip, .tooltip-bg").remove();
      });

    // Add line for total loans
    const line = d3
      .line()
      .x((d) => x(d.grade) + x.bandwidth() / 2)
      .y((d) => y2(d.total_loans))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6c757d") // Bootstrap secondary color
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2")
      .attr("d", line);

    // Add data points for total loans
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.grade) + x.bandwidth() / 2)
      .attr("cy", (d) => y2(d.total_loans))
      .attr("r", 4)
      .attr("fill", "#6c757d");

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

    // Add secondary y-axis
    g.append("g")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(
        d3
          .axisRight(y2)
          .ticks(5)
          .tickFormat((d) => `${(d / 1000).toFixed(1)}k`)
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
      .text("Default Rate by Loan Grade");

    // Add axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Loan Grade");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Default Rate (%)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", innerWidth + margin.right - 15)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Total Loans (thousands)");

    // Add legend
    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 10}, ${margin.top})`
      );

    // Legend for bar chart
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", color("A"));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("fill", "#adb5bd")
      .style("font-size", "10px")
      .text("Default Rate");

    // Legend for line chart
    legend
      .append("line")
      .attr("x1", 0)
      .attr("y1", 30)
      .attr("x2", 12)
      .attr("y2", 30)
      .attr("stroke", "#6c757d")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 34)
      .attr("fill", "#adb5bd")
      .style("font-size", "10px")
      .text("Total Loans");
  }, [data, loading]);

  if (loading) {
    return <div className="text-center">Loading chart...</div>;
  }

  return (
    <div className="loan-grade-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LoanGradeChart;
