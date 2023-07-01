import React from 'react';

import { render, screen } from '@testing-library/react';

import {application} from './../../src/client/index'

describe('Test Header', () => {
    it('Should return 4', () => {
        const testR = render(application)
        const { container, getByRole } = render(application);
console.log('!!!', getByRole('link'))
        // console.log(container.outerHTML);
        // expect(getByRole('link')).toHaveAttribute('href', 'https://www.test.com/');
    });
});
