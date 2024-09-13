import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ChartRace from "react-chart-race";

const ResponsiveChart = ({ chartData }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.98);

  useEffect(() => {
    // Resize chart when window is resized
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.98;
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <ChartRace
        data={chartData}
        backgroundColor="#ffffff"
        width={chartWidth}
        padding={window.innerWidth > 768 ? 20 : 10} 
        itemHeight={window.innerWidth > 768 ? 30 : 35} 
        gap={window.innerWidth > 768 ? 6 : 8} 
        titleStyle={{
          font: `normal 400 ${window.innerWidth > 768 ? "13px" : "10px"} inter`,
          color: "#212121",
        }}
        valueStyle={{
          font: `normal 400 ${window.innerWidth > 768 ? "11px" : "9px"} inter`,
          color: "#777",
        }}
      />
    </div>
  );
};
ResponsiveChart.propTypes = {
  chartData: PropTypes.array.isRequired,
};

export default ResponsiveChart;
