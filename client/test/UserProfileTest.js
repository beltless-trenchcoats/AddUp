import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { UserProfile } from '../src/UserProfile';

describe('Component: UserProfile', () => {
  it('renders without exploding', () => {
    expect(
      shallow(
        <UserProfile />
      ).length
    ).isEqual(1)
  });

  it('loads last 4 bank account digits');
  it('loads bank name');

});
