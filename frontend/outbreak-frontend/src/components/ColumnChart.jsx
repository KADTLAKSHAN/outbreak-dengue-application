import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios"; // Import axios

function ColumnChart() {
  const [state, setState] = useState({
    series: [
      {
        name: "Cases",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          tools: {
            download: true, // Enable download button
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + " cases";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#ffffff"],
        },
      },

      xaxis: {
        categories: [], // Will populate dynamically
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#ffffff", // Apply white text color to all x-axis labels
          },
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + " cases";
          },
        },
      },
      title: {
        text: "Monthly Cases", // Placeholder, will be updated dynamically
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#ffffff",
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
    },
  });

  useEffect(() => {
    // Fetch data from the API using axios
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/public/graph/monthly"
        );
        const data = response.data;

        // Extract year from the first item in the response (assuming all data is for the same year)
        const year =
          data.length > 0 ? data[0].caseYear : new Date().getFullYear();

        // Map the data from the API
        const categories = data.map((item) => item.caseMonth); // Get months
        const caseData = data.map((item) => item.numberOfCases); // Get cases

        // Update state with dynamic data
        setState((prevState) => ({
          ...prevState,
          series: [{ name: "Cases", data: caseData }],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: categories,
            },
            title: {
              ...prevState.options.title,
              text: `Monthly Cases in ${year}`, // Dynamically set the title with the year
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="bg-site p-6">
      <div id="chart" className="custom-chart">
        {" "}
        {/* Added custom-chart class for styling */}
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default ColumnChart;
