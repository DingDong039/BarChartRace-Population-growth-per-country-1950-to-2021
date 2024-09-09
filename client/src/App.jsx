import { useState, useEffect } from "react";
import Papa from "papaparse";
import ChartRace from "react-chart-race";

function App() {
  const [data, setData] = useState([]);
  const [yearIndex, setYearIndex] = useState(0);
  const [colorMap, setColorMap] = useState({});
  const [selectedCountries, setSelectedCountries] = useState([]);

  const dataUrl = "population-and-demography.csv"; // Replace with your CSV path

  const formatNumber = (number) => number.toLocaleString();

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Fetch CSV data and parse it
  useEffect(() => {
    const fetchCsvData = async () => {
      const response = await fetch(dataUrl);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvText = decoder.decode(result.value);

      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          setData(results.data);
        },
      });
    };

    fetchCsvData();
  }, []);

  // Group Year
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

  const groupedData = groupByYear(data);
  const years = Object.keys(groupedData);

  // Update yearIndex to cycle through the years
  useEffect(() => {
    const interval = setInterval(() => {
      setYearIndex((prevIndex) => (prevIndex + 1) % years.length);
    }, 500); // Change year every second

    return () => clearInterval(interval);
  }, [years.length]);

  const currentYearData = groupedData[years[yearIndex]] || [];

  const updateColorMap = (currentData) => {
    const newColorMap = { ...colorMap };

    currentData.forEach((item) => {
      if (!newColorMap[item.country]) {
        newColorMap[item.country] = getRandomColor();
      }
    });

    setColorMap(newColorMap);
  };

  useEffect(() => {
    if (currentYearData.length > 0) {
      updateColorMap(currentYearData);
      if (selectedCountries.length === 0) {
        const allCountries = currentYearData.map((item) => item.country);
        setSelectedCountries(allCountries);
      }
    }
  }, [currentYearData]);

  const toggleCountrySelection = (country) => {
    setSelectedCountries((prevSelected) => {
      if (prevSelected.includes(country)) {
        return prevSelected.filter((c) => c !== country);
      } else {
        return [...prevSelected, country];
      }
    });
  };

  const chartData = currentYearData
    .filter((item) => selectedCountries.includes(item.country))
    .map((item, index) => ({
      id: index,
      title: item.country,
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
      <div className="container w-full mx-auto px-4">
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
              className={`px-3 py-1 rounded ${
                selectedCountries.includes(item.country)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200"
              }`}
            >
              {item.country}
            </button>
          ))}
        </div>
        <div>
          <h1 className="font-bold text-center text-4xl">{years[yearIndex]}</h1>
          <h1 className="text-center text-xl font-medium text-slate-600">
            Total: {formatNumber(totalPopulation)}
          </h1>
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
        <div className="w-full">
          <ChartRace
            data={chartData}
            backgroundColor="#f5f5f5"
            width={1500}
            padding={20}
            itemHeight={25}
            gap={4}
            titleStyle={{ font: "normal 400 13px inter", color: "#212121" }}
            valueStyle={{ font: "normal 400 11px inter", color: "#777" }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
