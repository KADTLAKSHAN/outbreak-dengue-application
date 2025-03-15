import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function WeatherDetails() {
  const [weatherData, setWeatherData] = useState({
    predictYear: "",
    predictMonth: "",
    predictWeek: 1, // Default to Week 1
    avgMaxTemp: "",
    avgMinTemp: "",
    totalPrecipitation: "",
    avgWindSpeed: "",
    maxWindGusts: "",
    weatherCode: "",
    districtId: null,
  });
  const [districts, setDistricts] = useState([]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  // Options for week selection (1-4)
  const weekOptions = [
    { value: 1, label: "Week 1" },
    { value: 2, label: "Week 2" },
    { value: 3, label: "Week 3" },
    { value: 4, label: "Week 4" },
  ];

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axiosInstance.get("/api/public/district");
      setDistricts(
        response.data.content.map((district) => ({
          value: district.districtId,
          label: district.districtName,
        }))
      );
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWeatherData({ ...weatherData, [name]: value });
  };

  const handleDistrictChange = (selected) => {
    setWeatherData({ ...weatherData, districtId: selected });
  };

  const handleWeekChange = (selectedOption) => {
    setWeatherData({ ...weatherData, predictWeek: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure district is selected
    if (!weatherData.districtId) {
      alert("Please select a district.");
      return;
    }

    // Calculate the actual week number in the dataset
    const actualWeekNumber =
      (parseInt(weatherData.predictMonth, 10) - 1) * 4 +
      parseInt(weatherData.predictWeek, 10);

    // Prepare the payload
    const payload = {
      predictYear: parseInt(weatherData.predictYear, 10),
      predictMonth: parseInt(weatherData.predictMonth, 10),
      predictWeek: actualWeekNumber, // Use the calculated week number
      avgMaxTemp: parseFloat(weatherData.avgMaxTemp),
      avgMinTemp: parseFloat(weatherData.avgMinTemp),
      totalPrecipitation: parseFloat(weatherData.totalPrecipitation),
      avgWindSpeed: parseFloat(weatherData.avgWindSpeed),
      maxWindGusts: parseFloat(weatherData.maxWindGusts),
      weatherCode: weatherData.weatherCode,
    };

    try {
      const response = await axiosInstance.post(
        `/api/admin/prediction/${weatherData.districtId.value}`,
        payload
      );

      // Check for success status code (201)
      if (response.status === 201) {
        alert("Weather data submitted successfully!");

        // Reset the form
        setWeatherData({
          predictYear: "",
          predictMonth: "",
          predictWeek: 1, // Reset to Week 1
          avgMaxTemp: "",
          avgMinTemp: "",
          totalPrecipitation: "",
          avgWindSpeed: "",
          maxWindGusts: "",
          weatherCode: "",
          districtId: null,
        });
      } else {
        alert("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error submitting weather data:", error);
      if (error.response && error.response.data) {
        alert(`Failed to submit weather data: ${error.response.data.message}`);
      } else {
        alert("Failed to submit weather data. Please try again.");
      }
    }
  };

  // Custom styles for react-select to ensure black text
  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: "black", // Ensure text color is black
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black", // Ensure selected value text is black
    }),
    option: (provided) => ({
      ...provided,
      color: "black", // Ensure dropdown options text is black
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-black">
        Enter Week Weather Details
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* District Selection */}
        <div>
          <label className="block text-black font-semibold">District:</label>
          <Select
            options={districts}
            value={weatherData.districtId}
            onChange={handleDistrictChange}
            styles={customStyles}
            placeholder="Select a district..."
          />
        </div>

        {/* Predict Year */}
        <div>
          <label className="block text-black font-semibold">
            Predict Year:
          </label>
          <input
            type="number"
            name="predictYear"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.predictYear}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Predict Month */}
        <div>
          <label className="block text-black font-semibold">
            Predict Month:
          </label>
          <input
            type="number"
            name="predictMonth"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.predictMonth}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Predict Week */}
        <div>
          <label className="block text-black font-semibold">
            Predict Week:
          </label>
          <Select
            options={weekOptions}
            value={weekOptions.find(
              (option) => option.value === weatherData.predictWeek
            )}
            onChange={handleWeekChange}
            placeholder="-- Select Week --"
            className="text-black"
          />
        </div>

        {/* Average Maximum Temperature */}
        <div>
          <label className="block text-black font-semibold">
            Average Maximum Temperature:
          </label>
          <input
            type="number"
            name="avgMaxTemp"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.avgMaxTemp}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Average Minimum Temperature */}
        <div>
          <label className="block text-black font-semibold">
            Average Minimum Temperature:
          </label>
          <input
            type="number"
            name="avgMinTemp"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.avgMinTemp}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Total Precipitation */}
        <div>
          <label className="block text-black font-semibold">
            Total Precipitation:
          </label>
          <input
            type="number"
            name="totalPrecipitation"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.totalPrecipitation}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Average Wind Speed */}
        <div>
          <label className="block text-black font-semibold">
            Average Wind Speed:
          </label>
          <input
            type="number"
            name="avgWindSpeed"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.avgWindSpeed}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Maximum Wind Gusts */}
        <div>
          <label className="block text-black font-semibold">
            Maximum Wind Gusts:
          </label>
          <input
            type="number"
            name="maxWindGusts"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.maxWindGusts}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Weather Code */}
        <div>
          <label className="block text-black font-semibold">
            Weather Code:
          </label>
          <input
            type="text"
            name="weatherCode"
            className="w-full p-2 border rounded-md text-black"
            value={weatherData.weatherCode}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Submit Weather Data
        </button>
      </form>
    </div>
  );
}

export default WeatherDetails;
