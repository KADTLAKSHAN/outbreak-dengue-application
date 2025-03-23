import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

function LineGraphWeek() {
  const [series, setSeries] = useState([]);
  const [year, setYear] = useState(""); // Store year dynamically

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/public/graph/week")
      .then((response) => {
        if (response.data.length > 0) {
          const caseYear = response.data[0].caseYear; // Extract year dynamically
          setYear(caseYear);

          const data = response.data.map((item) => [
            item.caseWeek,
            item.numberOfCases,
          ]); // Keep weeks
          setSeries([{ name: "Number of Cases", data }]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const options = {
    chart: {
      id: "week-wise-cases",
      type: "line",
      zoom: { enabled: true, type: "x" },
      toolbar: { autoSelected: "zoom" },
      background: "#fff", // White background
    },
    title: {
      text: year ? `${year} - Weekly Dengue Cases` : "Weekly Dengue Cases",
      align: "center",
      style: { color: "#000", fontSize: "16px" }, // Black font
    },
    xaxis: {
      categories: series.length > 0 ? series[0].data.map((d) => d[0]) : [], // Use week numbers
      labels: { style: { colors: "#000" } }, // Black font
      title: { text: "Week Number", style: { color: "#000" } }, // Black font
    },
    yaxis: {
      title: { text: "Number of Cases", style: { color: "#000" } }, // Black font
      labels: { style: { colors: "#000" } }, // Black font
    },
    stroke: { curve: "smooth" },
    dataLabels: { enabled: false },
    grid: { show: true, borderColor: "#000" }, // Black grid
    tooltip: {
      theme: "dark", // Dark theme tooltip
      style: { fontSize: "12px", color: "#fff" }, // White text in tooltip
      y: {
        formatter: (value) => `${value} cases`,
      },
      x: {
        formatter: (week) => `Week ${week}`, // Show "Week X" in tooltip
      },
    },
  };

  return (
    <div>
      {series.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="line"
          height={350}
          className="custom-chart"
        />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
}

export default LineGraphWeek;
