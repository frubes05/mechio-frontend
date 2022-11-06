import React, { useState, useEffect } from "react";
import moment from "moment";

interface IChart {
  data: any;
}

const useChart = ({ data }: IChart) => {
  const [chartData, setChartData] = useState<any>(data);
  const [changeData, setChangeData] = useState<boolean>(false);

  useEffect(() => {
    setChartData((prev: any) =>
      prev.map((elem: any) => {
        return {
          ...elem,
          date: moment(elem.date).format("DD.MM.YYYY"),
        };
      })
    );
  }, []);

  const handleChartRequest = (type: string) => {
    if (type === "bar") {
      handleBarChart();
    } else if (type === "pie") {

    }
  };

  const handleBarChart = () => {
    setChartData((prev: any) =>
      prev.map((el: any) => {
        return {
          name: el.jobId,
          position: el.jobPosition,
          posjet: chartData.filter(
            (elem: any) => elem.jobId === el.jobId && elem.action === "Posjet"
          ).length,
          prijava: chartData.filter(
            (elem: any) => elem.jobId === el.jobId && elem.action === "Prijava"
          ).length,
        };
      })
    );
    const elements = removeDuplicates(chartData, 'name');
    setChartData({elements, type: 'bar'});
  };

  const removeDuplicates = (data: any, filter: string) => {
    const container = [] as any[];
    data.forEach((element: any) => {
      const exists = container.find((el) => el[filter] === element[filter]);
      if (exists) {
        return;
      } else {
        container.push(element);
      }
    });
    return container
  };

  return { chartData, handleChartRequest, changeData };
};

export default useChart;
