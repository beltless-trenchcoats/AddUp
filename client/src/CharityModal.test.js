import React from 'react';
import expect from 'expect';
import shallow from 'enzyme';
import CharityModal from './CharityModal';

const props = {
  charities: {
    charity1: '',
    charity2: ''
  }
};

const wrapper = shallow(<CharityModal {...props}/>);

describe('CharityModal', () => {

  it('should render components', () => {

    expect(wrapper.length).toEqual(2);
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

  // it('simulates click events', () => {
  //   const onButtonClick = sinon.spy();
  //   const wrapper = shallow(
  //     <CharityModal onClick={onButtonClick} />
  //   );
  //   wrapper.find('button').simulate('click');
  //   expect(onButtonClick.calledOnce).to.equal(true);
  // });

});