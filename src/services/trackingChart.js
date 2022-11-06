const moment = require("moment");

export const formatBarChart = (data) => {
  let elements = data
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .filter((c) => c.companyId !== c.userId)
    .map((el) => {
      return {
        action: el.action,
        date: el.date,
      };
    });
  elements = elements.map((el) => {
    return {
      prijava: elements.filter(
        (elem) => elem.date === el.date && elem.action === "Prijava"
      ).length,
      posjet: elements.filter(
        (elem) => elem.date === el.date && elem.action === "Posjet"
      ).length,
      name: el.date,
    };
  });
  elements = removeDuplicates(elements, "date");
  return {
    elements,
    type: "line",
    xAxis: "name",
    dataKey1: "prijava",
    dataKey2: "posjet",
  };
};

export const formatPieChart = (data) => {
  let elements = data
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .filter((c) => c.action === "Posjet");
  elements = elements.map((el) => {
    return {
      registriran: elements.filter((element) => element.isRegistered).length,
      neregistriran: elements.filter((element) => !element.isRegistered).length,
      name: "Registriran",
    };
  });
  elements = removeDuplicates(elements, "registriran");
  elements = makeSpecificArr(elements, 'registriran', 'neregistriran');
  return { elements, type: "pie" };
};

const makeSpecificArr = (arr, first, second) => {
  return [{
    name: first,
    value: arr[0][`${first}`]
  }, {
    name: second,
    value: arr[0][`${second}`]
  }]
}

export const formatSpecificJobs = (data) => {
  let elements = data
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .filter((c) => c.companyId !== c.userId);
  elements = elements.map((el) => {
    return {
      name: el.jobId,
      position: el.jobPosition,
      posjet: elements.filter(
        (elem) => elem.jobId === el.jobId && elem.action === "Posjet"
      ).length,
      prijava: elements.filter(
        (elem) => elem.jobId === el.jobId && elem.action === "Prijava"
      ).length,
    };
  });
  elements = removeDuplicates(elements, "name");
  return {
    elements,
    type: "bar",
    xAxis: "position",
    dataKey1: "prijava",
    dataKey2: "posjet",
  };
};

const removeDuplicates = (data, filter) => {
  const container = [];
  data.forEach((element) => {
    const exists = container.find((el) => el[filter] === element[filter]);
    if (exists) {
      return;
    } else {
      container.push(element);
    }
  });
  return container;
};
