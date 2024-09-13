import { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import getFlagCountry from "./utils/FlageCountry";

// components
import ResponsiveChart from "./components/ChartRace";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearIndex, setYearIndex] = useState(1950);
  const [colorMap, setColorMap] = useState({});
  const [selectedCountries, setSelectedCountries] = useState([]);

  const dataUrl = "population-and-demography.csv"; // CSV path Public folder
  const formatNumber = (number) => number.toLocaleString();

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const groupByYear = (data) => {
    return data.reduce((acc, curr) => {
      const { year, country, population } = curr;

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push({
        country,
        population: Number(population),
      });

      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error("Failed to fetch data");

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let csvText = "";
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          csvText += decoder.decode(value, { stream: !done });
        }

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            setData(results.data);
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data: ", error);
        setIsLoading(false);
      }
    };

    fetchCsvData()
      .then(() => console.log("Data fetched successfully"))
      .catch(console.error);
  }, [dataUrl]);

  const groupedData = groupByYear(data);
  const years = Object.keys(groupedData);

  useEffect(() => {
    if (years.length > 0) {
      const interval = setInterval(() => {
        setYearIndex((prevIndex) => (prevIndex + 1) % years.length);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [years.length]);

  const currentYearData = useMemo(
    () => groupedData[years[yearIndex]] || [],
    [groupedData, years, yearIndex]
  );

  const updateColorMap = useCallback(
    (currentData) => {
      let newColorMap = { ...colorMap };
      let colorUpdated = false;

      currentData.forEach((item) => {
        if (!newColorMap[item.country]) {
          newColorMap[item.country] = getRandomColor();
          colorUpdated = true;
        }
      });

      if (colorUpdated) {
        setColorMap(newColorMap);
      }
    },
    [colorMap]
  );

  useEffect(() => {
    if (currentYearData.length > 0) {
      updateColorMap(currentYearData);
      if (selectedCountries.length === 0 && currentYearData.length > 0) {
        const allCountries = currentYearData.map((item) => item.country);
        setSelectedCountries(allCountries);
      }
    }
  }, [currentYearData, selectedCountries, updateColorMap]);

  const toggleCountrySelection = (country) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(country)) {
        return prevSelected.filter((c) => c !== country);
      } else {
        return [...prevSelected, country];
      }
    });
  };

  if (isLoading) {
    return <div>Loading data...</div>; // Display loading indicator
  }

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  const chartData = currentYearData
    .filter((item) => selectedCountries.includes(item.country))
    .map((item, index) => ({
      id: index,
      title: (
        <div className="flex items-center">
          <img
            src={getFlagCountry(item.country)}
            alt={item.country}
            className="w-6 h-5 mr-2"
          />
          {item.country}
        </div>
      ),
      value: item.population,
      color: colorMap[item.country],
    }));

  const totalPopulation = currentYearData.reduce(
    (acc, curr) => acc + curr.population,
    0
  );

  const progressPercentage = ((yearIndex + 1) / years.length) * 100; //progress bar

  return (
    <>
      <div className="w-full mx-auto px-4">
        <div className="py-3">
          <h1 className="font-bold text-center text-4xl">
            Population growth per country 1950 to 2021
          </h1>
        </div>
        {/* Legend: Toggle buttons country */}
        <div className="flex flex-wrap space-x-2 mb-4 gap-2">
          {currentYearData.map((item) => (
            <button
              key={item.country}
              onClick={() => toggleCountrySelection(item.country)}
              className={`flex items-center space-x-2 px-3 py-1 rounded ${
                selectedCountries.includes(item.country)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: colorMap[item.country] || "#ccc" }}
              />
              <span>{item.country}</span>
            </button>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-6 bg-gray-300 rounded mb-4 relative">
          <div
            className="h-6 bg-blue-500 rounded"
            style={{ width: `${progressPercentage}%` }}
          />
          <span className="absolute inset-0 text-center text-black font-bold">
            {years[yearIndex]}
          </span>
        </div>
        {/* ChartRace Population */}
        {/* {chartData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-2"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.title}</span>
              </div>
              <span>{formatNumber(item.value)}</span>
            </div>
          ))} */}
        <div className="relative w-full">
          <div className="absolute right-10 bottom-5 z-10">
            <h1 className="font-bold text-center text-4xl">
              {years[yearIndex]}
            </h1>
            <h1 className="text-center text-xl font-medium text-slate-600">
              Total: {formatNumber(totalPopulation)}
            </h1>
          </div>
          {chartData && chartData.length > 0 ? (
            <ResponsiveChart chartData={chartData} />
          ) : (
            <div>No chart data available</div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
