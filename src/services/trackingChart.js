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
      date: el.date,
    };
  });
  elements = removeDuplicates(elements);
  return elements;
};

export const formatPieChart = (data) => {
  let elements = data
    .map((elem) => {
      return {
        ...elem,
        date: moment(elem.date).format("DD.MM.YYYY"),
      };
    })
    .filter((c) => c.action === 'Posjet');
    elements = elements.map((el) => {
      return {
        registriran: elements.filter(element => element.isRegistered).length,
        neregistriran: elements.filter(element => !element.isRegistered).length,
        name: 'Registriran',
      };
    });
    return elements;
}

const removeDuplicates = (data) => {
  const container = [];
  data.forEach((element) => {
    const exists = container.find((el) => el.date === element.date);
    if (exists) {
      return;
    } else {
      container.push(element);
    }
  });
  return container;
};
