import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

function BarChartDistrict() {
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 500,
      toolbar: {
        tools: {
          download: true, // Enable download button
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: true, // Makes the bars horizontal
      },
    },
    dataLabels: {
      enabled: false, // Disables data labels
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: "#000000", // Black font for x-axis labels
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000000", // Black font for y-axis labels
        },
      },
    },
    colors: ["#000000"], // Set bar color to black
    title: {
      text: "District Dengue Cases", // Placeholder
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#000000", // Title text
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark", // Set the theme to dark
      style: {
        background: "#000000", // Tooltip background color (black)
        color: "#ffffff", // Tooltip text color (white)
      },
      marker: {
        show: true,
      },
    },
  });

  const [series, setSeries] = useState([
    {
      data: [], // Will be populated dynamically
    },
  ]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/public/graph/district"
        );
        const data = response.data;

        // Extract district names and total cases
        const categories = data.map((item) => item.districtName);
        const totalCases = data.map((item) => item.totalCases);

        // Extract year from the first item in the response (assuming all data is for the same year)
        const year =
          data.length > 0 ? data[0].caseYear : new Date().getFullYear();

        // Update the chart options and series
        setOptions((prevOptions) => ({
          ...prevOptions,
          xaxis: {
            ...prevOptions.xaxis,
            categories: categories,
          },
          title: {
            ...prevOptions.title,
            text: `${year} District Dengue Cases`, // title with year
          },
        }));

        setSeries([
          {
            data: totalCases,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array to run only once on mount

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={500}
        className="custom-chart" // Custom class for styling
      />
    </div>
  );
}

export default BarChartDistrict;
