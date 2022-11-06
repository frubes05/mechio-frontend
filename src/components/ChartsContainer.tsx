import React, { useEffect, useState } from "react";

import { formatBarChart, formatPieChart } from "../services/trackingChart";
import {
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
} from "recharts";

interface IChartsData {
  data: any;
}

const ChartsContainer: React.FC<IChartsData> = ({ data }) => {
  const [formattedData, setFormattedData] = useState<any[]>([]);
  useEffect(() => {
    //setFormattedData((prev: any[]) => [...prev, formatBarChart(data)]);
    setFormattedData((prev: any[]) => [...prev, formatPieChart(data)]);
  }, []);

  return (
    <>
      {formattedData &&
        formattedData.map((formatData, i) => (
          <section key={i}>
            {/*<BarChart width={730} height={250} data={formatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date">
                <Label
                  value="Ukupne dnevne prijave i posjeti na oglase"
                  offset={0}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis
                label={{ value: "Klikovi", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="prijava" fill="#8884d8" />
              <Bar dataKey="posjet" fill="#82ca9d" />
        </BarChart>*/}
            {/*<PieChart width={730} height={250}>
              <Pie
                data={formatData.filter((el: any) => el.registriran)}
                dataKey="registriran"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                fill="#8884d8"
              />
              <Pie
                data={formatData.filter((el: any) => el.neregistriran)}
                dataKey="neregistriran"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                <LabelList dataKey="neregistrirani pregledi" position="insideTop" />
              </Pie>
      </PieChart>*/}
          </section>
        ))}
    </>
  );
};

export default ChartsContainer;
