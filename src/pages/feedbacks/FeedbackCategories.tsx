import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const categories = [
  {
    category: "team",
    hr: "Tim",
  },
  {
    category: "projects",
    hr: "Projekti",
  },
  {
    category: "technology",
    hr: "Tehnologije",
  },
  {
    category: "culture",
    hr: "Kultura",
  },
  {
    category: "pay",
    hr: "Plaća",
  },
];

const FeedbackCategories: React.FC<{onSelected: Function}> = ({onSelected}) => {
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (selected) {
        onSelected(selected)
    }
  }, [selected]);

  return (
    <>
      <Form.Label>Odaberite kategoriju</Form.Label>
      <ul className="modal-categories">
        {categories.map((category) => {
          if (category.category === selected) {
            return (
              <li key={category.hr}>
                <Button
                  className={`modal-category ${
                    selected ? "modal-category--selected" : ""
                  }`}
                  onClick={() => setSelected(category.hr)}
                >
                  {category.hr}
                </Button>
              </li>
            );
          } else {
            return (
              <li key={category.hr}>
                <Button
                  className="modal-category"
                  onClick={() => setSelected(category.hr)}
                >
                  {category.hr}
                </Button>
              </li>
            );
          }
        })}
      </ul>
    </>
  );
};

export default FeedbackCategories;
