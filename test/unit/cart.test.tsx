import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import * as reduxHooks from "react-redux";
import { CartBadge } from "../../src/client/components/CartBadge";



describe("CartBage", () => {
  it("not item in cart store", async () => {
    const initialStoreCart = {};
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreCart);
    const app = <CartBadge id={0} />;
    const { container } = render(app);
    expect(container.getElementsByClassName("CartBadge").length).toEqual(0);
    expect(container).toMatchSnapshot();
  });

  it("item in cart store", async () => {
    const initialStoreCart = {
      "0": {
        name: "Awesome Ball",
        count: 1,
        price: 190,
      },
    };
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreCart);

    const app = <CartBadge id={0} />;
    const { container } = render(app);
    expect(container.getElementsByClassName("CartBadge").length).toEqual(1);
    expect(container).toMatchSnapshot();
  });
  it("items in cart store", async () => {
    const initialStoreCart = {
        "0": {
            "name": "Awesome Ball",
            "count": 1,
            "price": 190
        },
        "1": {
            "name": "Sleek Chips",
            "count": 1,
            "price": 606
        },
        "2": {
            "name": "Incredible Hat",
            "count": 1,
            "price": 245
        },
        "3": {
            "name": "Incredible Hat",
            "count": 1,
            "price": 519
        },
        "4": {
            "name": "Gorgeous Keyboard",
            "count": 1,
            "price": 300
        },
        "5": {
            "name": "Gorgeous Ball",
            "count": 1,
            "price": 762
        }
    }
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreCart);

    const app = <CartBadge id={0} />;
    const { container } = render(app);
    expect(container.getElementsByClassName("CartBadge").length).toEqual(1);
    expect(container).toMatchSnapshot();
  });
  it("items in cart store", async () => {
    const initialStoreCart = {
        "0": {
            "name": "Awesome Ball",
            "count": 1,
            "price": 190
        },
        "1": {
            "name": "Sleek Chips",
            "count": 1,
            "price": 606
        },
        "2": {
            "name": "Incredible Hat",
            "count": 1,
            "price": 245
        },
        "3": {
            "name": "Incredible Hat",
            "count": 1,
            "price": 519
        },
        "4": {
            "name": "Gorgeous Keyboard",
            "count": 1,
            "price": 300
        },
        "5": {
            "name": "Gorgeous Ball",
            "count": 1,
            "price": 762
        }
    }
    jest.spyOn(reduxHooks, "useSelector").mockReturnValue(initialStoreCart);

    const app = <CartBadge id={10} />;
    const { container } = render(app);
    expect(container.getElementsByClassName("CartBadge").length).toEqual(0);
    expect(container).toMatchSnapshot();
  });
});
