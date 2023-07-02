import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { createStore } from "redux";
import { Application } from "./../../src/client/Application";
import { Catalog } from "./../../src/client/pages/Catalog";

import userEvent from "@testing-library/user-event";
import * as reduxHooks from "react-redux";

const initialState = {
  cart: {},
};

function reducer(state = initialState, action: any) {
  return state;
}

const initialStoreProducts = [
  {
    id: 0,
    name: "Practical Pizza",
    price: 67,
  },
  {
    id: 1,
    name: "Refined Pants",
    price: 335,
  },
  {
    id: 2,
    name: "Licensed Pants",
    price: 450,
  },
  {
    id: 3,
    name: "Sleek Salad",
    price: 451,
  },
  {
    id: 4,
    name: "Gorgeous Fish",
    price: 998,
  },
  {
    id: 5,
    name: "Sleek Car",
    price: 802,
  },
  {
    id: 6,
    name: "Ergonomic Tuna",
    price: 541,
  },
  {
    id: 7,
    name: "Gorgeous Bike",
    price: 169,
  },
  {
    id: 8,
    name: "Rustic Towels",
    price: 342,
  },
  {
    id: 9,
    name: "Handcrafted Soap",
    price: 215,
  },
  {
    id: 10,
    name: "Small Chips",
    price: 371,
  },
  {
    id: 11,
    name: "Awesome Shirt",
    price: 25,
  },
  {
    id: 12,
    name: "Ergonomic Pizza",
    price: 571,
  },
  {
    id: 13,
    name: "Fantastic Shoes",
    price: 189,
  },
  {
    id: 14,
    name: "Small Towels",
    price: 567,
  },
  {
    id: 15,
    name: "Licensed Mouse",
    price: 774,
  },
  {
    id: 16,
    name: "Ergonomic Shoes",
    price: 804,
  },
  {
    id: 17,
    name: "Practical Chicken",
    price: 227,
  },
  {
    id: 18,
    name: "Practical Computer",
    price: 409,
  },
  {
    id: 19,
    name: "Ergonomic Computer",
    price: 665,
  },
  {
    id: 20,
    name: "Awesome Towels",
    price: 17,
  },
  {
    id: 21,
    name: "Incredible Car",
    price: 921,
  },
  {
    id: 22,
    name: "Intelligent Mouse",
    price: 215,
  },
  {
    id: 23,
    name: "Unbranded Chair",
    price: 699,
  },
  {
    id: 24,
    name: "Unbranded Bike",
    price: 88,
  },
  {
    id: 25,
    name: "Refined Chair",
    price: 91,
  },
  {
    id: 26,
    name: "Handcrafted Computer",
    price: 710,
  },
];

const store = createStore(reducer);

describe("Catalog", () => {
  it("all products rendered", async () => {
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreProducts);

    const app = (
      <BrowserRouter>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(app);

    expect(container.getElementsByClassName("ProductItem").length).toEqual(
      initialStoreProducts.length
    );
  });
});
