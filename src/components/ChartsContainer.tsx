import React, { useEffect, useState } from "react";

import {
  formatBarChart,
  formatPieChart,
  formatSpecificJobs,
  formatSpecificLocation,
  formatJobNumber,
  formatFeedbackNumber,
} from "../services/trackingChart";
import {
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
} from "recharts";

interface IChartsData {
  data: any;
  width?: number;
  page: string;
  labelName?: string;
}

const COLORS = ["#3c4043", "#00c6b4"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartsContainer: React.FC<IChartsData> = ({
  data,
  page,
  labelName,
  width,
}) => {
  const [formattedData, setFormattedData] = useState<any>([]);

  useEffect(() => {
    if (page === "company") {
      setFormattedData((prev: any[]) => [...prev, formatBarChart(data)]);
      setFormattedData((prev: any[]) => [...prev, formatSpecificJobs(data)]);
      setFormattedData((prev: any[]) => [...prev, formatPieChart(data)]);
      setFormattedData((prev: any[]) => [
        ...prev,
        formatSpecificLocation(data),
      ]);
    } else if (page === "general") {
      if (labelName === "jobs") {
        setFormattedData((prev: any[]) => [...prev, formatJobNumber(data)]);
      } else {
        setFormattedData((prev: any[]) => [
          ...prev,
          formatFeedbackNumber(data),
        ]);
      }
    }
  }, []);

  return (
    <section id="recharts">
      {formattedData?.length &&
        formattedData?.map((formatData: any, i: number) => {
          if (formattedData[i].type === "bar") {
            return (
              <BarChart
                key={i}
                width={width!}
                height={300}
                data={formatData.elements}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={formattedData[i].xAxis} stroke={`${
                      page === "general"
                        ? labelName === "jobs"
                          ? "#00c6b4"
                          : "#ffde4d"
                        : "#3c4043"
                    }`}>
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                {formattedData[i].yAxis && (
                  <YAxis
                    label={{
                      value: formattedData[i].yAxis,
                      angle: -90,
                      position: "insideLeft",
                      fill: `${page === "general"
                      ? labelName === "jobs"
                        ? "#00c6b4"
                        : "#ffde4d"
                      : "#3c4043"}`
                    }}
                    stroke={`${
                      page === "general"
                        ? labelName === "jobs"
                          ? "#00c6b4"
                          : "#ffde4d"
                        : "#3c4043"
                    }`}
                  >
                    <Label fill="white" position="left"></Label>
                  </YAxis>
                )}
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={formattedData[i].dataKey1}
                  fill={`${
                    page === "general"
                      ? labelName === "jobs"
                        ? "#00c6b4"
                        : "#ffde4d"
                      : "#3c4043"
                  }`}
                />
                {!formattedData[i].singleBar && (
                  <Bar dataKey={formattedData[i].dataKey2} fill="#00c6b4" />
                )}
              </BarChart>
            );
          } else if (formattedData[i].type === "pie") {
            return (
              <PieChart width={width!} height={300} key={i}>
                <Pie
                  data={formattedData[i].elements}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                  label={renderCustomizedLabel}
                />
                <Legend verticalAlign="bottom" height={20} />
                {formatData.elements.map((entry: any, index: number) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  );
                })}
                <Tooltip />
              </PieChart>
            );
          } else if (formattedData[i].type === "line") {
            return (
              <LineChart
                key={i}
                width={width!}
                height={300}
                data={formatData.elements}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={formattedData[i].xAxis} />
                <YAxis
                  label={{
                    value: formattedData[i].yAxis,
                    angle: -90,
                    position: "outside",
                  }}
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                  textAnchor="middle"
                  dominantBaseline={"central"}
                  type="monotone"
                  dataKey={formattedData[i].dataKey1}
                  stroke="#3c4043"
                  strokeDasharray="5 5"
                />
                <Line
                  textAnchor="middle"
                  dominantBaseline={"central"}
                  type="monotone"
                  dataKey={formattedData[i].dataKey2}
                  stroke="#00c6b4"
                  strokeDasharray="3 4 5 2"
                />
              </LineChart>
            );
          }
        })}
    </section>
  );
};

export default ChartsContainer;
