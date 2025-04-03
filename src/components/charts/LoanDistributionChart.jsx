// src/components/charts/LoanDistributionChart.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import apiService from "../../api/creditRiskApi";

const LoanDistributionChart = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd fetch this data from the API
        // For now, we'll generate some sample data
        const sampleData = [
          { range: "0-5k", count: 2450 },
          { range: "5k-10k", count: 5230 },
          { range: "10k-15k", count: 8650 },
          { range: "15k-20k", count: 6540 },
          { range: "20k-25k", count: 4320 },
          { range: "25k-30k", count: 2870 },
          { range: "30k+", count: 1520 },
        ];

        setData(sampleData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching loan distribution data:", error);
        setLoading(false);
      }
    };

    fetchData();
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
      .domain(data.map((d) => d.range))
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) * 1.1])
      .nice()
      .range([innerHeight, 0]);

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
          .tickFormat((d) => d.toLocaleString())
      )
      .selectAll("text")
      .style("fill", "#adb5bd")
      .style("font-size", "10px");

    // Add grid lines (IBCS-compliant)
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .selectAll("line")
      .style("stroke", "rgba(255, 255, 255, 0.1)");

    // Add bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.range))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerHeight - y(d.count))
      .attr("fill", "#0d6efd")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#0a58ca");

        // Add tooltip
        g.append("text")
          .attr("class", "tooltip")
          .attr("x", x(d.range) + x.bandwidth() / 2)
          .attr("y", y(d.count) - 10)
          .attr("text-anchor", "middle")
          .style("fill", "white")
          .style("font-size", "12px")
          .text(`${d.count.toLocaleString()} loans`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#0d6efd");
        g.selectAll(".tooltip").remove();
      });

    // Add chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Distribution of Loan Amounts");

    // Add axis labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Loan Amount Range");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .style("fill", "#adb5bd")
      .style("font-size", "11px")
      .text("Number of Loans");
  }, [data, loading]);

  if (loading) {
    return <div className="text-center">Loading chart...</div>;
  }

  return (
    <div className="loan-distribution-chart">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LoanDistributionChart;
