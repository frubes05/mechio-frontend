const moment = require("moment");

export const formatBarChart = (data) => {
  let elements = data.sort((date1, date2) => date1.date - date2.date);
  elements = elements
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .sort((date1, date2) => date1.date - date2.date)
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
  elements = removeDuplicates(elements, "name");
  return {
    elements,
    type: "line",
    xAxis: "name",
    yAxis: "Iznos po danima",
    dataKey1: "prijava",
    dataKey2: "posjet",
    singleBar: false,
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
  const nonUserLength = elements.filter(el => el.userId === 'null').length;
  elements = elements.map((el) => {
    return {
      registriran: elements.filter((element) => element.isRegistered).length,
      neregistriran: elements.filter((element) => !element.isRegistered && element.userId !== 'null').length + nonUserLength,
      name: "registriran",
    };
  });
  elements = removeDuplicates(elements, "registriran");
  return {
    elements,
    type: "bar",
    xAxis: "name",
    yAxis: "Broj posjeta korisnika",
    dataKey1: "registriran",
    dataKey2: "neregistriran",
    singleBar: false,
  };
};

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
    yAxis: "Iznos po oglasima",
    dataKey1: "prijava",
    dataKey2: "posjet",
    singleBar: false,
  };
};

export const formatSpecificLocation = (data) => {
  let elements = data
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .filter((c) => c.companyId !== c.userId && c.action === "Prijava");
  elements = elements.map((el) => {
    return {
      name: el.jobId,
      lokacija: el.userLocation,
      iznos: elements.filter((elem) => elem.userLocation === el.userLocation)
        .length,
    };
  });
  elements = removeDuplicates(elements, "lokacija");
  return {
    elements,
    type: "bar",
    xAxis: "lokacija",
    yAxis: "Lokacije prijavljenih",
    dataKey1: "iznos",
    singleBar: true,
  };
};

export const formatJobNumber = (data) => {
  let elements = data;
  elements = elements.map(el => {
    return {
      tvrtka: elements.find(d => d.company === el.company).company,
      poslovi: elements.filter(d => d.companyId === el.companyId).length
    }
  })
  elements = removeDuplicates(elements, "tvrtka");
  return {
    elements,
    type: "bar",
    xAxis: "tvrtka",
    yAxis: "Broj",
    dataKey1: "poslovi",
    singleBar: true,
  };
};

export const formatFeedbackNumber = (data) => {
  let elements = [...data.flat(1)];
  elements = elements.map(el => {
    return {
      tvrtka: elements.find(d => d.companyName === el.companyName).companyName,
      recenzije: elements.filter(d => d.companyId === el.companyId).length
    }
  })
  elements = removeDuplicates(elements, "tvrtka");
  return {
    elements,
    type: "bar",
    xAxis: "tvrtka",
    yAxis: "Broj",
    dataKey1: "recenzije",
    singleBar: true,
  };
};

const makeSpecificArr = (arr, first, second) => {
  return [
    {
      name: first,
      value: arr[0][`${first}`],
    },
    {
      name: second,
      value: arr[0][`${second}`],
    },
  ];
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
