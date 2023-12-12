import React from 'react'
import Logo from './logo'

describe('<Logo />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Logo />)
  })
})