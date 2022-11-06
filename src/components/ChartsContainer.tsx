import React, { useEffect, useState } from "react";

import {
  formatBarChart,
  formatPieChart,
  formatSpecificJobs,
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
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface IChartsData {
  data: any;
  width?: number;
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

const ChartsContainer: React.FC<IChartsData> = ({ data }) => {
  const [formattedData, setFormattedData] = useState<any>([]);

  useEffect(() => {
    setFormattedData((prev: any[]) => [...prev, formatBarChart(data)]);
    setFormattedData((prev: any[]) => [...prev, formatSpecificJobs(data)]);
    setFormattedData((prev: any[]) => [...prev, formatPieChart(data)]);
  }, []);

  return (
    <section id="recharts">
      {formattedData?.length &&
        formattedData?.map((formatData: any, i: number) => {
          if (formattedData[i].type === "bar") {
            return (
              <BarChart
                key={i}
                width={700}
                height={300}
                data={formatData.elements}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={formattedData[i].xAxis}>
                  <Label offset={0} position="insideBottom" />
                </XAxis>
                <YAxis
                  label={{ value: formattedData[i].yAxis, angle: -90, position: "outside" }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey={formattedData[i].dataKey1} fill="#3c4043" />
                <Bar dataKey={formattedData[i].dataKey2} fill="#00c6b4" />
              </BarChart>
            );
          } else if (formattedData[i].type === "pie") {
            return (
              <PieChart width={700} height={300} key={i}>
                <Pie
                  data={formattedData[i].elements}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                  label={renderCustomizedLabel}
                />
                <Legend verticalAlign="bottom" height={20}/>
                {formatData.elements.map((entry: any, index: number) => {
                  return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                })}
                <Tooltip />
              </PieChart>
            );
          } else if (formattedData[i].type === "line") {
            return (
              <LineChart
                key={i}
                width={700}
                height={300}
                data={formatData.elements}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={formattedData[i].xAxis} />
                <YAxis label={{ value: formattedData[i].yAxis, angle: -90, position: "outside" }} />
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
