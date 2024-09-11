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

  const getFlagUrl = (country) => {
    const flagUrls = {
      USA: "https://flagsapi.com/US/flat/64.png",
      India: "https://flagsapi.com/IN/flat/64.png",
      China: "https://flagsapi.com/CN/flat/64.png",
      UK: "https://flagsapi.com/GB/flat/64.png",
      WF: "https://flagsapi.com/WF/flat/64.png",
      Singapore: "https://flagsapi.com/SG/flat/64.png",
      Seychelles: "https://flagsapi.com/SC/flat/64.png",
      Japan: "https://flagsapi.com/JP/flat/64.png",
      Germany: "https://flagsapi.com/DE/flat/64.png",
      France: "https://flagsapi.com/FR/flat/64.png",
      Canada: "https://flagsapi.com/CA/flat/64.png",
      Brazil: "https://flagsapi.com/BR/flat/64.png",
      Australia: "https://flagsapi.com/AU/flat/64.png",
      "United Arab Emirates": "https://flagsapi.com/AE/flat/64.png",
      Ukraine: "https://flagsapi.com/UA/flat/64.png",
      Turkey: "https://flagsapi.com/TR/flat/64.png",
      Thailand: "https://flagsapi.com/TH/flat/64.png",
      Switzerland: "https://flagsapi.com/CH/flat/64.png",
      Sweden: "https://flagsapi.com/SE/flat/64.png",
      Spain: "https://flagsapi.com/ES/flat/64.png",
      SouthAfrica: "https://flagsapi.com/ZA/flat/64.png",
      Russia: "https://flagsapi.com/RU/flat/64.png",
      Portugal: "https://flagsapi.com/PT/flat/64.png",
      Poland: "https://flagsapi.com/PL/flat/64.png",
      Philippines: "https://flagsapi.com/PH/flat/64.png",
      Peru: "https://flagsapi.com/PE/flat/64.png",
      Pakistan: "https://flagsapi.com/PK/flat/64.png",
      Norway: "https://flagsapi.com/NO/flat/64.png",
      Netherlands: "https://flagsapi.com/NL/flat/64.png",
      Mexico: "https://flagsapi.com/MX/flat/64.png",
      Malaysia: "https://flagsapi.com/MY/flat/64.png",
      Italy: "https://flagsapi.com/IT/flat/64.png",
      Indonesia: "https://flagsapi.com/ID/flat/64.png",
      Greece: "https://flagsapi.com/GR/flat/64.png",
      Egypt: "https://flagsapi.com/EG/flat/64.png",
      Denmark: "https://flagsapi.com/DK/flat/64.png",
      Colombia: "https://flagsapi.com/CO/flat/64.png",
      Chile: "https://flagsapi.com/CL/flat/64.png",
      Belgium: "https://flagsapi.com/BE/flat/64.png",
      Argentina: "https://flagsapi.com/AR/flat/64.png",
      "United Kingdom": "https://flagsapi.com/GB/flat/64.png",
      "United States": "https://flagsapi.com/US/flat/64.png",
      "South Korea": "https://flagsapi.com/KR/flat/64.png",
      "Saudi Arabia": "https://flagsapi.com/SA/flat/64.png",
      "New Zealand": "https://flagsapi.com/NZ/flat/64.png",
      "Czech Republic": "https://flagsapi.com/CZ/flat/64.png",
      "Costa Rica": "https://flagsapi.com/CR/flat/64.png",
      "Cote d'Ivoire": "https://flagsapi.com/CI/flat/64.png",
      "Congo (Kinshasa)": "https://flagsapi.com/CD/flat/64.png",
      "Congo (Brazzaville)": "https://flagsapi.com/CG/flat/64.png",
      "Central African Republic": "https://flagsapi.com/CF/flat/64.png",
      "Cayman Islands": "https://flagsapi.com/KY/flat/64.png",
      "Cape Verde": "https://flagsapi.com/CV/flat/64.png",
      Cameroon: "https://flagsapi.com/CM/flat/64.png",
      Cambodia: "https://flagsapi.com/KH/flat/64.png",
      Burundi: "https://flagsapi.com/BI/flat/64.png",
      BurkinaFaso: "https://flagsapi.com/BF/flat/64.png",
      Bulgaria: "https://flagsapi.com/BG/flat/64.png",
      Brunei: "https://flagsapi.com/BN/flat/64.png",
      Botswana: "https://flagsapi.com/BW/flat/64.png",
      Bosnia: "https://flagsapi.com/BA/flat/64.png",
      Bolivia: "https://flagsapi.com/BO/flat/64.png",
      Bhutan: "https://flagsapi.com/BT/flat/64.png",
      Benin: "https://flagsapi.com/BJ/flat/64.png",
      Belize: "https://flagsapi.com/BZ/flat/64.png",
      Belarus: "https://flagsapi.com/BY/flat/64.png",
      Bangladesh: "https://flagsapi.com/BD/flat/64.png",
      Bahrain: "https://flagsapi.com/BH/flat/64.png",
      Bahamas: "https://flagsapi.com/BS/flat/64.png",
      Azerbaijan: "https://flagsapi.com/AZ/flat/64.png",
      Austria: "https://flagsapi.com/AT/flat/64.png",
      Armenia: "https://flagsapi.com/AM/flat/64.png",
      "Argentina": "https://flagsapi.com/AR/flat/64.png",
      Angola: "https://flagsapi.com/AO/flat/64.png",
      Andorra: "https://flagsapi.com/AD/flat/64.png",
      Albania: "https://flagsapi.com/AL/flat/64.png",
      Afghanistan: "https://flagsapi.com/AF/flat/64.png",
      Nigeria: "https://flagsapi.com/NG/flat/64.png",
      Iran: "https://flagsapi.com/IR/flat/64.png",
      Ethiopia: "https://flagsapi.com/ET/flat/64.png",
      Vietnam: "https://flagsapi.com/VN/flat/64.png",
      "North Korea": "https://flagsapi.com/KP/flat/64.png",
      Iraq: "https://flagsapi.com/IQ/flat/64.png",
      Venezuela: "https://flagsapi.com/VE/flat/64.png",
      Myanmar: "https://flagsapi.com/MM/flat/64.png",
      "Democratic Republic of Congo": "https://flagsapi.com/CD/flat/64.png",
      Romania: "https://flagsapi.com/RO/flat/64.png",
      Morocco: "https://flagsapi.com/MA/flat/64.png",
      Ghana: "https://flagsapi.com/GH/flat/64.png",
      Algeria: "https://flagsapi.com/DZ/flat/64.png",
      Kenya: "https://flagsapi.com/KE/flat/64.png",
      Nepal: "https://flagsapi.com/NP/flat/64.png",
      Kazakhstan: "https://flagsapi.com/KZ/flat/64.png",
      Mozambique: "https://flagsapi.com/MZ/flat/64.png",
      Hungary: "https://flagsapi.com/HU/flat/64.png",
      Cuba: "https://flagsapi.com/CU/flat/64.png",
      Czechia: "https://flagsapi.com/CZ/flat/64.png",
      Madagascar: "https://flagsapi.com/MG/flat/64.png",
      Mali: "https://flagsapi.com/ML/flat/64.png",
      "Falkland Islands": "https://flagsapi.com/FK/flat/64.png",
      Ecuador: "https://flagsapi.com/EC/flat/64.png",
      "Dominican Republic": "https://flagsapi.com/DO/flat/64.png",
      "Dominica": "https://flagsapi.com/DM/flat/64.png",
    };
    
    return flagUrls[country] || 'default-flag.svg';  // Default flag
  };

  const chartData = currentYearData
    .filter((item) => selectedCountries.includes(item.country))
    .map((item, index) => ({
      id: index,
      title: (
        <div className="flex items-center">
          <img
            src={getFlagUrl(item.country)}
            alt={item.country}
            className="w-4 h-4 mr-2"
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
