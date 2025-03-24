import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

function LineGraphYear() {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/public/graph/year")
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;

          const years = data.map((item) => item.caseYear); // Extract years
          const cases = data.map((item) => item.numberOfCases); // Extract cases

          setCategories(years);
          setSeries([{ name: "Dengue Cases", data: cases }]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const options = {
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false },
      background: "#fff", // White background
    },
    title: {
      text: "Yearly Dengue Cases",
      align: "center",
      style: { color: "#000", fontSize: "16px" }, // Black font
    },
    colors: ["#000000"],
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: categories, // Year values
      labels: { style: { colors: "#000" } },
      title: { text: "Year", style: { color: "#000" } },
    },
    yaxis: {
      title: { text: "Number of Cases", style: { color: "#000" } },
      labels: { style: { colors: "#000" } },
    },
    tooltip: {
      theme: "dark", // Dark theme tooltip
      style: { fontSize: "12px", color: "#fff" }, // White text in tooltip
      y: { formatter: (value) => `${value} cases` },
    },
  };

  return (
    <div>
      {series.length > 0 ? (
        <ReactApexChart
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

export default LineGraphYear;
