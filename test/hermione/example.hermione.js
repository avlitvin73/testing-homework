const { assert } = require('chai');

let bug_id = 0;
let base_url = 'http://localhost:3000/hw/store';
let bug_url = `http://localhost:3000/hw/store?bug_id=${bug_id}`;
let main_url = base_url; // можно изменить тестовый url

if (process.env.BUG_ID !== undefined) {
    bug_id = process.env.BUG_ID;
}

describe('Общие требования:', async () => {
    const windowSizes = [1399, 1199, 991, 767, 575];
    windowSizes.forEach((w) => adaptivePage(w));

    function adaptivePage(width) {
        it(`1. Адаптивная верстка при ширине экрана ${width + 1}`, async ({ browser }) => {
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

    it('4. На ширине меньше 576px навигационное меню должно скрываться за гамбургер', async ({ browser }) => {
        await browser.setWindowSize(575, 500);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const appToggler = await browser.$('.Application-Toggler');
        const appMenu = await browser.$('.Application-Menu');

        assert.equal(await appToggler.isDisplayed(), true, 'Гамбургер должен появиться');
        assert.equal(await appMenu.isDisplayed(), false, 'Навигационное меню должно скрыться');
    });

    it('5. При выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
        await browser.setWindowSize(575, 500);
        await browser.url(main_url);

        const page = await browser.$('.Application');
        await page.waitForExist();

        const appToggler = await browser.$('.Application-Toggler');
        const appMenu = await browser.$('.Application-Menu');

        assert.equal(await appToggler.isDisplayed(), true, 'Гамбургер должен появиться');

        await appToggler.click();
        assert.equal(await appMenu.isDisplayed(), true, 'Меню должно открыться при клике на гамбургер');

        await appMenu.click();
        assert.equal(await appMenu.isDisplayed(), false, 'Меню должно закрыться при выборе элемента');
    });
});