// components/ColumnChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import { useRevenuePerDay } from "../../services/api";

const ColumnChart = () => {
  const { data: chartData, loading, error } = useRevenuePerDay();

  const options = {
    colors: ["#1A56DB"],
    chart: {
      type: "bar",
      height: 320,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: { left: 2, right: 2, top: -14 },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    fill: { opacity: 1 },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontFamily: "Inter, sans-serif" },
    },
    states: {
      hover: {
        filter: { type: "darken", value: 1 },
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: chartData,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      {loading ? (
        <div className="text-center text-sm text-gray-500">Loading chart...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-sm">{error}</div>
      ) : (
        <Chart options={options} series={series} type="bar" height={320} />
      )}
    </div>
  );
};

export default ColumnChart;
