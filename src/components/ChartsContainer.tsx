import React, { useEffect, useState } from "react";

import { formatBarChart, formatPieChart, formatSpecificJobs } from "../services/trackingChart";
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
    //setFormattedData((prev: any[]) => [...prev, formatPieChart(data)]);
    setFormattedData((prev: any[]) => [...prev, formatSpecificJobs(data)])
  }, []);

  return (
    <>
      {formattedData &&
        formattedData.map((formatData, i) => (
          <section key={i}>
            <BarChart width={730} height={250} data={formatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position">
                <Label
                  value="Ukupne dnevne prijave i posjeti na oglase"
                  offset={0}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis
                label={{ value: "Iznos", angle: -90, position: "inside" }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="prijava" fill="#8884d8" />
              <Bar dataKey="posjet" fill="#82ca9d" />
        </BarChart>
            {/*<BarChart width={730} height={250} data={formatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date">
                <Label
                  value="Korisnici"
                  offset={0}
                  position="insideBottom"
                />
              </XAxis>
              <YAxis
                label={{ value: "Broj posjeta oglasima", angle: -90, position: "inside" }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="registriran" fill="#8884d8" />
              <Bar dataKey="neregistriran" fill="#82ca9d" />
      </BarChart>*/}
          </section>
        ))}
    </>
  );
};

export default ChartsContainer;
