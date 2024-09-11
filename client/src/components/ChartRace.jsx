import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ChartRace from "react-chart-race";

const ResponsiveChart = ({ chartData }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.9); // Set initial chart width to 90% of window

  useEffect(() => {
    // Resize chart when window is resized
    const handleResize = () => {
      const newWidth = window.innerWidth * 0.9; // Adjust chart width based on window size
      setChartWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <ChartRace
        data={chartData}
        backgroundColor="#f5f5f5"
        width={chartWidth} // Make the width responsive
        padding={window.innerWidth > 768 ? 20 : 10} // Reduce padding on smaller screens
        itemHeight={window.innerWidth > 768 ? 30 : 35} // Reduce item height on smaller screens
        gap={window.innerWidth > 768 ? 6 : 8} // Reduce gap on smaller screens
        titleStyle={{
          font: `normal 400 ${window.innerWidth > 768 ? "13px" : "10px"} inter`,
          color: "#212121",
        }} // Adjust font size based on screen size
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
