import React, { useState, useEffect } from "react";
import { IJobs } from "../pages/jobs/Jobs.types";
import { Dropdown, Button, Container } from "react-bootstrap";
import { type } from "os";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

interface IFilter {
  filterOptions: { en: string; hr: string }[];
  jobs: IJobs[];
  getAllSelected: Function;
  resetSelected: Function;
}

interface ISelectedValue {
  type: string;
  value: string;
}

const Filter: React.FC<IFilter> = ({
  filterOptions,
  jobs,
  getAllSelected,
  resetSelected,
}) => {
  const [selectedValue, setSelectedValue] = useState<ISelectedValue[] | []>([]);

  useEffect(() => {
    getAllSelected(selectedValue);
  }, [selectedValue]);

  const handleSelectedValue = (value: any, option: string) => {
    const alreadyInside = selectedValue?.find((elem) => elem.value === value);
    if (alreadyInside) {
      setSelectedValue((prev) => [...prev]);
    } else {
      const sameType = selectedValue?.find((elem) => elem.type === option);
      if (sameType) {
        const newArr = selectedValue.filter((elem) => elem.type !== option);
        setSelectedValue((prev) => [...newArr, { type: option, value: value }]);
      } else {
        setSelectedValue((prev) => [...prev, { type: option, value: value }]);
      }
    }
  };

  const handleResetSelected = () => {
    resetSelected();
    setSelectedValue([]);
  }

  return (
    <Container>
      <div className="jobs__list-filters">
        {filterOptions &&
          filterOptions.map((option: any, id: number) => {
            let newElements = Array.from(new Set(jobs.map((job:any) => job[option.en])));
            newElements = newElements.map(elem => {
              return {
                [option.en] : elem
              }
            });
            return (
              <Dropdown key={id}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {option.hr}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {jobs &&
                    jobs.length > 0 &&
                    newElements.map((job: any, i: number) => {
                      return (
                        <Dropdown.Item
                          key={`${id}-${i}`}
                          onClick={() =>
                            handleSelectedValue(job[option.en], option.en)
                          }
                        >
                          {job[option.en]}
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
            );
          })}
        <Button className="jobs__list-reset" onClick={() => handleResetSelected()}>
          Reset
        </Button>
      </div>
      <p className="jobs__list-filtervalues">Odabrane vrijednosti ({selectedValue.length}): <span>{selectedValue.map(elem => elem.value).join(', ')}</span></p>
    </Container>
  );
};

export default Filter;
