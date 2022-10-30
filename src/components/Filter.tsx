import React, { useState, useEffect } from "react";
import { IJobs } from "../pages/jobs/Jobs.types";
import { ICompany } from "../pages/companies/Company.types";
import { Dropdown, Button, Container, Row, Col } from "react-bootstrap";
import { IFeedback } from "../pages/feedbacks/Feedbacks.types";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

interface IFilter {
  filterOptions: { en: string; hr: string }[];
  jobs: IJobs[] | ICompany[] | IFeedback[];
  getAllSelected: Function;
  resetSelected: Function;
  title?: string;
  additional?: string;
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
  title,
  additional
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
  };

  return (
    <Container className={`jobs__filter ${additional ? 'jobs__filter--feedbacks': ''}`}>
      <Row>
        <Col xlg={8} lg={8} md={8}>
          <h5 className="jobs__list-subtitle">Filtriranje mogućnosti</h5>
          {title && <h2 className="jobs__list-title">
            {title}
          </h2>}
        </Col>
        <Col>
        <div className="jobs__list-filters">
          {filterOptions &&
            filterOptions.map((option: any, id: number) => {
              let newElements = Array.from(
                new Set(jobs.map((job: any) => job[option.en]))
              );
              newElements = newElements.map((elem) => {
                return {
                  [option.en]: elem,
                };
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
          <Button
            className="jobs__list-reset"
            onClick={() => handleResetSelected()}
          >
            Reset
          </Button>
        </div>
        <p className="jobs__list-filtervalues">
          Odabrane vrijednosti ({selectedValue.length}):{" "}
          <span>{selectedValue.map((elem) => elem.value).join(", ")}</span>
        </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Filter;
