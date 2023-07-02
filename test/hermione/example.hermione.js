const { assert } = require('chai');

const bug_id = 0;
const base_url = 'http://localhost:3000/hw/store';
const api_url = 'http://localhost:3000/hw/store/api/products'
const bug_url = `http://localhost:3000/hw/store?bug_id=${bug_id}`;
const main_url = base_url; // можно изменить тестовый url

if (process.env.BUG_ID !== undefined) {
    bug_id = process.env.BUG_ID;
}


describe('1️⃣ вёрстка должна адаптироваться под ширину экрана', async () => {
    const windowSizes = [2167, 1083, 875, 722, 575];
    windowSizes.forEach((w) => adaptivePage(w));

    function adaptivePage(width) {
        it(`вёрстка при ширине экрана ${width + 1}`, async ({ browser }) => {
            await browser.setWindowSize(width, 1080);
            await browser.url(main_url);

            const page = await browser.$('.Application');
            await page.waitForExist();

            await browser.assertView(`plain${width + 1}`, '.Application', {
                screenshotDelay: 1000,
                compositeImage: true,
            });
        });
    }
})

describe('2️⃣ в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async () => {
    const links = [
        'catalog',
        'delivery',
        'contacts',
        'cart'
    ]
    links.forEach((link) => checkLink(link));

    function checkLink(link) {
        it(`в шапке отображается ссылка на ${link}`, async ({ browser }) => {
            await browser.url(main_url);

            const page = await browser.$('.Application');
            await page.waitForExist();

            const catalogLink = await browser.$(`.nav-link[href*="/hw/store/${link}"]`);
            assert.equal(await catalogLink.isDisplayed(), true, `отображается ссылка на ${link}`);
        });
    }
});

describe('3️⃣ название магазина в шапке должно быть ссылкой на главную страницу', async () => {
    const links = [
        '',
        'catalog',
        'delivery',
        'contacts',
        'cart',
        'catalog/0'
    ]
    links.forEach((link) => checkMainLink(link));

    function checkMainLink(link) {
        it(`название магазина в шапке ${link} ведет на главную страницу`, async ({ browser }) => {
            await browser.url(main_url + `/${link}`);

            const page = await browser.$('.Application');
            await page.waitForExist();

            const mainLink = await browser.$(`.Application-Brand`);
            assert.equal(await mainLink.getAttribute("href"), '/hw/store/', `отображается ссылка на ${link}`);
        });
    }
});


describe('4️⃣ на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async () => {
    it('на ширине меньше 320px', async ({ browser }) => {
        await browser.setWindowSize(320, 540);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const toggler = await browser.$('.Application-Toggler');
        const menu = await browser.$('.Application-Menu');

        assert.equal(await toggler.isDisplayed(), true, 'кнопка меню отображается');
        assert.equal(await menu.isDisplayed(), false, 'навигационное меню скрыто');
    });

    it('на ширине меньше 575px', async ({ browser }) => {
        await browser.setWindowSize(575, 540);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const toggler = await browser.$('.Application-Toggler');
        const menu = await browser.$('.Application-Menu');

        assert.equal(await toggler.isDisplayed(), true, 'кнопка меню отображается');
        assert.equal(await menu.isDisplayed(), false, 'навигационное меню скрыто');
    });
    it('на ширине меньше 576px', async ({ browser }) => {
        await browser.setWindowSize(576, 540);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const toggler = await browser.$('.Application-Toggler');
        const menu = await browser.$('.Application-Menu');

        assert.equal(await toggler.isDisplayed(), false, 'кнопка меню скрыта');
        assert.equal(await menu.isDisplayed(), true, 'навигационное меню отображается');
    });
})

describe('5️⃣ при выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
        await browser.setWindowSize(575, 540);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const toggler = await browser.$('.Application-Toggler');
        const menu = await browser.$('.Application-Menu');

        assert.equal(await toggler.isDisplayed(), true, 'навигационное меню должно появиться');

        await toggler.click();
        assert.equal(await menu.isDisplayed(), true, 'навигационное меню должно открыться при клике');

        await menu.click();
        assert.equal(await menu.isDisplayed(), false, 'навигационное меню должно закрыться при выборе элемента');
    });
});

describe('6️⃣ страницы главная, условия доставки, контакты должны иметь статическое содержимое', async () => {
    const links = [
        '',
        'delivery',
        'contacts',
    ]
    links.forEach((link) => staticPage(link));

    function staticPage(link) {
        it(`Страница ${link} имеет статическое содержимое`, async ({ browser }) => {
            await browser.url(main_url + `/${link}`);

            const page = await browser.$('.Application');
            await page.waitForExist();

            await browser.assertView(`plain${link}`, '.Application', {
                screenshotDelay: 1000,
                compositeImage: true,
            });
        });
    }
});



describe('7️⃣ в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
    it(`Каждый продукт отображен`, async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(api_url);
        await page.content();
        const products = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        let index = 0
        for (const product of products) {
            await browser.url(main_url + `/catalog`);
            const catalog = await browser.$('.Application');
            await catalog.waitForExist();

            const productElem = await browser.$(`.ProductItem[data-testid="${index}"]`);
            assert.equal(await productElem.isDisplayed(), true, `${index} продукт должен отображаться`);
        }
    });
})


describe('8️⃣ для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
    it(`для каждого товара в каталоге отображается название`, async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(api_url);
        await page.content();
        const products = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        let index = 0
        for (const product of products) {
            await page.goto(main_url + `/catalog`);
            await page.waitForSelector(`.ProductItem`)

            const elementName = await page.$(`.ProductItem[data-testid="${index}"] .ProductItem-Name`)
            const productName = await page.evaluate(el => el.textContent, elementName)
            assert.equal(productName, product.name, `продукт ${product.name} должен отображается`);
            index++
        }
    })
    it(`для каждого товара в каталоге отображается цена`, async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(api_url);
        await page.content();
        const products = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        let index = 0
        for (const product of products) {
            await page.goto(main_url + `/catalog`);
            await page.waitForSelector(`.ProductItem`)

            const elementPrice = await page.$(`.ProductItem[data-testid="${index}"] .ProductItem-Price`)
            const productPrice = await page.evaluate(el => el.textContent, elementPrice)
            assert.equal(productPrice, `$${product.price}`, `цена продукта ${product.name} должна быть $${product.price}`);
            index++
        }
    })
    it(`для каждого товара в каталоге отображается ссылка на страницу с подробной информацией о товаре`, async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(api_url);
        await page.content();
        const products = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        let index = 0
        for (const product of products) {
            await page.goto(main_url + `/catalog`);
            await page.waitForSelector(`.ProductItem`)

            const elementDetailsLink = await browser.$(`.ProductItem[data-testid="${index}"] .ProductItem-DetailsLink`)

            assert.equal(await elementDetailsLink.getAttribute("href"), `/hw/store/catalog/${index}`, `отображается ссылка на продукт ${product.name}`);
            index++
        }
    })
})

describe('9️⃣ на каждой странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину"', async () => {
    const params = ['Name', 'Description', 'Price', 'Color', 'Material']
    for (const param of params) {

        it(`на каждой странице с подробной информацией отображается ${param}`, async ({ browser }) => {
            const puppeteer = await browser.getPuppeteer();
            const [page] = await puppeteer.pages();
            await page.goto(api_url);
            await page.content();
            const products = await page.evaluate(() => {
                return JSON.parse(document.querySelector("body").innerText);
            });
            for (const index in products) {

                await page.goto(api_url + `/${index}`);
                await page.content();
                const uniqProduct = await page.evaluate(() => {
                    return JSON.parse(document.querySelector("body").innerText);
                });

                await page.goto(main_url + `/catalog/${index}`);
                await page.waitForSelector(`.ProductDetails`)

                const element = await page.$(`.ProductDetails-${param}`)
                const text = await page.evaluate(el => el.textContent, element)
                if (param === 'Price') {
                    uniqProduct[param.toLowerCase()] = `$${uniqProduct[param.toLowerCase()]}`
                }
                assert.equal(text, uniqProduct[param.toLowerCase()], `${param} продукта ${uniqProduct[param.toLowerCase()]} корректно`);
            }
        })
    }
    it(`на каждой странице с подробной информацией отображается кнопка "добавить в корзину"`, async ({ browser }) => {
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(api_url);
        await page.content();
        const products = await page.evaluate(() => {
            return JSON.parse(document.querySelector("body").innerText);
        });
        for (const index in products) {

            await browser.url(main_url + `/catalog/${index}`);
            const element = await browser.$(`.ProductDetails-AddToCart`)
            assert.equal(await element.isDisplayed(), true, 'кнопка меню добавить отображается');
        }
    })
    it(`на странице с подробной информацией корректная верстка`, async ({ browser }) => {
        await browser.url(main_url + `/catalog/0`);
        const page = await browser.$('.ProductDetails');
        await page.waitForExist();
        await browser.assertView(`product`, '.Application', {
            screenshotDelay: 1000,
            compositeImage: true,
        });

    })
})

describe('1️⃣0️⃣ если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
    it(`после клика на добавить появляется надпись Item in cart`, async ({ browser }) => {
        await browser.url(main_url + `/catalog/0`);
        const button = await browser.$(`.ProductDetails-AddToCart`)
        await button.click()
        const cartBadge = await browser.$(`.CartBadge`)
        assert.equal(await cartBadge.isDisplayed(), true, `появляется надпись Item in cart`);
        await browser.assertView(`cartBadge`, '.ProductDetails', {
            screenshotDelay: 1000,
            compositeImage: true,
            ignoreElements: [
                ".ProductDetails-Name",
                ".ProductDetails-Description",
                ".ProductDetails-Price",
                ".ProductDetails-Color",
                ".ProductDetails-Material",
                ".Image",
            ],
        });

        await browser.url(main_url + '/catalog');
        const cardInCart = await browser.$(`.ProductItem[data-testid="0"] .CartBadge`)
        assert.equal(await cardInCart.isDisplayed(), true, `появляется надпись Item in cart`);
        const cardNotInCart = await browser.$(`.ProductItem[data-testid="1"] .CartBadge`)
        assert.equal(await cardNotInCart.isDisplayed(), false, `скрыта надпись Item in cart`);

        await browser.url(main_url + `/catalog/0`);
        const cartBadgeAgain = await browser.$(`.CartBadge`)
        assert.equal(await cartBadgeAgain.isDisplayed(), true, `появляется надпись Item in cart`);


    })
})


describe('1️⃣1️⃣ если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
    it(`увеличивать количество товара незначительно`, async ({ browser }) => {
        const index = 0
        await browser.url(main_url + `/catalog/${index}`);
        const button = await browser.$(`.ProductDetails-AddToCart`)
        await button.click()

        await browser.url(main_url + `/catalog/${index}`);
        const buttonAgain = await browser.$(`.ProductDetails-AddToCart`)
        await buttonAgain.click()


        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(main_url + `/cart`);
        await page.waitForSelector(`.Cart`)

        const elementCount = await page.$(`tr[data-testid="${index}"] .Cart-Count`)
        const productCount = await page.evaluate(el => el.textContent, elementCount)
        assert.equal(productCount, '2', `количество добавленного продукта в корзине корректно`);

    })

})



describe('1️⃣2️⃣ содержимое корзины должно сохраняться между перезагрузками страницы', async () => {
    it(`перезагрузка корзины`, async ({ browser }) => {
        const index = 0
        await browser.url(main_url + `/catalog/${index}`);
        const button = await browser.$(`.ProductDetails-AddToCart`)
        await button.click()

        await browser.url(main_url + `/catalog/${index + 1}`);
        const buttonAgain = await browser.$(`.ProductDetails-AddToCart`)
        await buttonAgain.click()

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(main_url + `/cart`);
        await page.waitForSelector(`.Cart`)

        const cartTable = await page.$(`.Cart-Table`)
        const cartTableContent = await page.evaluate(el => el.textContent, cartTable)

        await page.reload()

        const cartTableAgain = await page.$(`.Cart-Table`)
        const cartTableContentAgain = await page.evaluate(el => el.textContent, cartTableAgain)

        assert.equal(cartTableContent, cartTableContentAgain, `содержимое корзины корректно`);

    })

})

describe('1️⃣3️⃣ в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
    it(`два разных товара`, async ({ browser }) => {
        const index = 0
        await browser.url(main_url + `/catalog/${index}`);
        const button = await browser.$(`.ProductDetails-AddToCart`)
        await button.click()

        await browser.url(main_url + `/catalog/${index + 1}`);
        const buttonAgain = await browser.$(`.ProductDetails-AddToCart`)
        await buttonAgain.click()

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(main_url + `/cart`);
        await page.waitForSelector(`.Cart`)

        const cartLink = await page.$(`.nav-link[href*="/hw/store/cart"]`);
        const cartLinkContent = await page.evaluate(el => el.textContent, cartLink)
        assert.equal(cartLinkContent, `Cart (2)`, `содержимое корзины корректно`);
    })
    it(`два по два разных товара`, async ({ browser }) => {
        const index = 0
        await browser.url(main_url + `/catalog/${index}`);
        const button = await browser.$(`.ProductDetails-AddToCart`)
        await button.click()

        await browser.url(main_url + `/catalog/${index + 1}`);
        const buttonAgain = await browser.$(`.ProductDetails-AddToCart`)
        await buttonAgain.click()

        await browser.url(main_url + `/catalog/${index}`);
        const buttonTwice = await browser.$(`.ProductDetails-AddToCart`)
        await buttonTwice.click()

        await browser.url(main_url + `/catalog/${index + 1}`);
        const buttonAgainTwice = await browser.$(`.ProductDetails-AddToCart`)
        await buttonAgainTwice.click()

        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.goto(main_url + `/cart`);
        await page.waitForSelector(`.Cart`)

        const cartLink = await page.$(`.nav-link[href*="/hw/store/cart"]`);
        const cartLinkContent = await page.evaluate(el => el.textContent, cartLink)
        assert.equal(cartLinkContent, `Cart (2)`, `содержимое корзины корректно`);
    })

})


describe('1️⃣4️⃣ в корзине должна отображаться таблица с добавленными в нее товарами', async () => {
    it(`два разных товара`, async ({ browser }) => {
    })
})