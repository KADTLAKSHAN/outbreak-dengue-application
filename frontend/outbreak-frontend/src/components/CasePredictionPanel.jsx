import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

// Weather code mapping
const weatherCodeMap = {
  0: "Cloud development not observed or not observable",
  1: "Clouds generally dissolving or becoming less developed",
  2: "State of sky on the whole unchanged",
  3: "Clouds generally forming or developing",
  51: "Continuous drizzle, slight at time of observation",
  53: "Continuous drizzle, moderate at time of observation",
  55: "Continuous drizzle, heavy (dense) at time of observation",
  61: "Rain, not freezing, intermittent, slight at time of observation",
  63: "Rain, not freezing, intermittent, moderate at time of observation",
  65: "Rain, not freezing, intermittent, heavy at time of observation",
};

function CasePredictionPanel() {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    predictYear: 2025,
    predictMonth: 1,
    predictWeek: 1, // Default to Week 1
    avgMaxTemp: 28.0,
    avgMinTemp: 26.0,
    totalPrecipitation: 10.0,
    avgWindSpeed: 28.0,
    maxWindGusts: 25.0,
    weatherCode: 51,
  });

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
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get("/api/public/district");
        if (response.data && Array.isArray(response.data.content)) {
          const formattedDistricts = response.data.content.map((district) => ({
            value: district.districtId,
            label: district.districtName,
          }));
          setDistricts(formattedDistricts);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        setError("Failed to load districts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) });
  };

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
  };

  const handleWeekChange = (selectedOption) => {
    setFormData({ ...formData, predictWeek: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDistrict) {
      alert("Please select a district.");
      return;
    }

    try {
      // Calculate the actual week number in the dataset
      const actualWeekNumber =
        (formData.predictMonth - 1) * 4 + formData.predictWeek;

      // Update the formData with the calculated week number
      const updatedFormData = { ...formData, predictWeek: actualWeekNumber };

      const response = await axiosInstance.post(
        `/api/public/prediction/${selectedDistrict.value}`,
        updatedFormData
      );
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Prediction request failed:", error);
      alert("Failed to get prediction. Please try again.");
    }
  };

  // User-friendly labels for input fields
  const inputLabels = {
    predictYear: "Prediction Year",
    predictMonth: "Prediction Month",
    predictWeek: "Prediction Week",
    avgMaxTemp: "Average Maximum Temperature (°C)",
    avgMinTemp: "Average Minimum Temperature (°C)",
    totalPrecipitation: "Total Precipitation (mm)",
    avgWindSpeed: "Average Wind Speed (km/h)",
    maxWindGusts: "Maximum Wind Gusts (km/h)",
    weatherCode: "Weather Code",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black mb-4">
        Dengue Case Prediction
      </h2>

      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      )}

      <label className="block text-black font-semibold">Select District:</label>
      {loading ? (
        <p className="text-black">Loading districts...</p>
      ) : (
        <Select
          options={districts}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="-- Select District --"
          className="mb-4 text-black"
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="text-black font-semibold">
                {inputLabels[key]}:
              </label>
              {key === "predictWeek" ? (
                <Select
                  options={weekOptions}
                  value={weekOptions.find(
                    (option) => option.value === formData.predictWeek
                  )}
                  onChange={handleWeekChange}
                  placeholder="-- Select Week --"
                  className="text-black"
                />
              ) : (
                <input
                  type={
                    key.includes("Temp") ||
                    key.includes("Precipitation") ||
                    key.includes("Wind")
                      ? "number"
                      : "number"
                  }
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md text-black"
                  step={
                    key.includes("Temp") ||
                    key.includes("Precipitation") ||
                    key.includes("Wind")
                      ? "0.1"
                      : "1"
                  }
                  required
                />
              )}
            </div>
          ))}

          {/* Weather Code Guide Card */}
          <div className="col-span-2">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                Weather Code Guide
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(weatherCodeMap).map(([code, description]) => (
                  <div
                    key={code}
                    className={`p-2 text-sm rounded ${
                      formData.weatherCode === parseInt(code)
                        ? "bg-blue-400 border border-blue-300 font-medium"
                        : "bg-white text-black"
                    }`}
                  >
                    <span className="font-bold text-blue-600">{code}:</span>{" "}
                    {description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Predict Cases
        </button>
      </form>

      {predictionResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-bold text-black">Prediction Result:</h3>
          <p className="text-black">
            {Math.round(predictionResult.predicted_cases)} cases expected.
          </p>
        </div>
      )}
    </div>
  );
}

export default CasePredictionPanel;
