import { render } from '@testing-library/react';
import Architect from './index';

import { Provider } from "react-redux";
import store from "../../store";

import Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

describe('HomePage tests', () => {
    it('HomePage renders without craching', () => {
        const homepage = render(<Provider store={store}><Architect /></Provider>);
        expect(homepage).toMatchSnapshot();
    });
})

