import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Application } from "./../../src/client/Application";

const initialState = {
  cart: {},
};

function reducer(state = initialState, action: any) {
  return state;
}

const store = createStore(reducer);

describe("Application", () => {
  it("renders navbar with correct links", () => {
    const app = (
      <BrowserRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );
    render(app);

    expect(screen.getByText("Example store")).toBeInTheDocument();
    expect(screen.getByText("Example store")).toHaveAttribute('href', '/');
    expect(screen.getByText("Catalog")).toBeInTheDocument();
    expect(screen.getByText("Catalog")).toHaveAttribute('href', '/catalog')
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toHaveAttribute('href', '/delivery')
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toHaveAttribute('href', '/contacts')
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toHaveAttribute('href', '/cart')
  });

});
