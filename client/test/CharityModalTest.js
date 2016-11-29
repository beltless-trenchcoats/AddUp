import React from 'react';
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';
import CharityModal from '../CharityModal';

const wrapper = shallow(<CharityModal />);

describe('<CharityModal />', () => {

  it('should render components', () => {

    expect(wrapper.find(CharityModalEntry)).to.have.length(???????????????);
  });

  // it('should render an `.icon-star`', () => {
    
  //   expect(wrapper.find('.icon-star')).to.have.length(????????????????);
  // });

  it('should render children when passed in', () => {
    const wrapper = shallow(
      <CharityModal>
        <div className="unique" />
      </CharityModal>
    );
    expect(wrapper.contains(<div className="unique" />)).to.equal(true);
  });

  it('simulates click events', () => {
    const onButtonClick = sinon.spy();
    const wrapper = shallow(
      <CharityModal onClick={onClick} />
    );
    wrapper.find('button').simulate('click');
    expect(onClick.calledOnce).to.equal(true);
  });

});