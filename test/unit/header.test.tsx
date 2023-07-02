import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Application } from "./../../src/client/Application";

import userEvent from "@testing-library/user-event";
import mediaQuery from "css-mediaquery";

const initialState = {
  cart: {},
};

function reducer(state = initialState, action: any) {
  return state;
}

const store = createStore(reducer);

function createMatchMedia(width: number) {
  return (query: any) => {
    return {
      matches: mediaQuery.match(query, { width }),
      media: "",
      addListener: () => {},
      removeListener: () => {},
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    };
  };
}

function resizeScreenSize(width: number) {
  window.matchMedia = createMatchMedia(width);
}

const resizeWindow = (x: number, y: number) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent(new Event("resize"));
};

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
    expect(screen.getByText("Example store")).toHaveAttribute("href", "/");
    expect(screen.getByText("Catalog")).toBeInTheDocument();
    expect(screen.getByText("Catalog")).toHaveAttribute("href", "/catalog");
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toHaveAttribute("href", "/delivery");
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toHaveAttribute("href", "/contacts");
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toHaveAttribute("href", "/cart");
  });
});

describe("Show burger button", () => {
  it("mobile size", async () => {
    const app = (
      <BrowserRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );
    resizeScreenSize(575);
    const { container } = render(app);

    expect(screen.getByLabelText("Toggle navigation")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle navigation")).toBeVisible();

    expect(
      container.getElementsByClassName("Application-Toggler")[0].parentElement
    ).toHaveStyle("display: block");
  });
});

describe("Open-close menu", () => {
  it("renders navbar with correct links", async () => {
    const app = (
      <BrowserRouter>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(app);

    expect(screen.getByLabelText("Toggle navigation")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Toggle navigation"));
    expect(container.getElementsByClassName("collapse").length).toEqual(0);

    await userEvent.click(screen.getByText("Catalog"));
    expect(container.getElementsByClassName("collapse").length).toEqual(1);

    await userEvent.click(screen.getByLabelText("Toggle navigation"));
    expect(container.getElementsByClassName("collapse").length).toEqual(0);

    await userEvent.click(screen.getByText("Delivery"));
    expect(container.getElementsByClassName("collapse").length).toEqual(1);

    await userEvent.click(screen.getByLabelText("Toggle navigation"));
    expect(container.getElementsByClassName("collapse").length).toEqual(0);

    await userEvent.click(screen.getByText("Contacts"));
    expect(container.getElementsByClassName("collapse").length).toEqual(1);

    await userEvent.click(screen.getByLabelText("Toggle navigation"));
    expect(container.getElementsByClassName("collapse").length).toEqual(0);

    await userEvent.click(screen.getByText("Cart"));
    expect(container.getElementsByClassName("collapse").length).toEqual(1);
  });
});
