import React, { useState, useEffect } from 'react'
import Disclaimer from '../components/Disclaimer';
import { PrimaryButton, SecondaryButton, SuccessButton, DangerButton } from '../components/Buttons'

import { DateRangePicker } from 'react-dates';

export default function FuncCalculator() {
  const [originalRent, totalPastRent, currentRent, setRent] = useState(0);
  const [area] = useState([{ text: 'Learn Hooks' }]);
  const [cpi] = useState(0.033);

  const handleChange = event => setRent(event.target.value);

  const validateInput = event => {};

  return (
       <div>
         <PrimaryButton onClick={() => this.setState({showSection: true})}>I think I am being overcharged. Am I owed money?</PrimaryButton>
       </div>


    )
}