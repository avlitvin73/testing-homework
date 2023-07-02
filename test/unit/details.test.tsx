import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Product } from "./../../src/client/pages/Product";

import * as reduxHooks from "react-redux";

const initialState = {
  cart: {},
};

function reducer(state = initialState, action: any) {
  return state;
}

const initialStoreProduct = {
  id: 0,
  name: "Fantastic Keyboard",
  description:
    "The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design",
  price: 133,
  color: "olive",
  material: "Wooden",
};

const store = createStore(reducer);

describe("Product", () => {
  it("correct display product", async () => {
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreProduct);

    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
      useParams: () => ({
        id: "0",
      }),
      useRouteMatch: () => ({ url: "/hw/store/catalog/0" }),
    }));

    const app = (
      <BrowserRouter>
        <Provider store={store}>
          <Product />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(app);
    expect(
      container.getElementsByClassName("ProductDetails-Name")[0].innerHTML
    ).toEqual(initialStoreProduct.name);
    expect(
      container.getElementsByClassName("ProductDetails-Description")[0]
        .innerHTML
    ).toEqual(initialStoreProduct.description);
    expect(
      container.getElementsByClassName("ProductDetails-Price")[0].innerHTML
    ).toEqual(`$${initialStoreProduct.price}`);
    expect(
      container.getElementsByClassName("ProductDetails-Color")[0].innerHTML
    ).toEqual(initialStoreProduct.color);
    expect(
      container.getElementsByClassName("ProductDetails-Material")[0].innerHTML
    ).toEqual(initialStoreProduct.material);
    expect(
      container.getElementsByClassName("ProductDetails-AddToCart").length
    ).toEqual(1);
    expect(container).toMatchSnapshot();
  });
});
