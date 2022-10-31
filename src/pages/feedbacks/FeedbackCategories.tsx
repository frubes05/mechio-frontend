import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

const FeedbackCategories: React.FC<{onSelected: Function, categories: {category: string; hr: string}[]}> = ({onSelected, categories}) => {
  const [selected, setSelected] = useState<{hr: string, category: string} | null>(null);

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
          if (category.category === selected?.category) {
            return (
              <li key={category.hr}>
                <Button
                  className={`modal-category ${
                    selected ? "modal-category--selected" : ""
                  }`}
                  onClick={() => setSelected({hr: category.hr, category: category.category})}
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
                  onClick={() => setSelected({ category: category.category, hr: category.hr})}
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
