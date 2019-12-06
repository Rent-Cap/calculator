import React, { useState } from 'react'
import './mailchimp.css'
import { PrimaryButton } from './Buttons'

const subscribe = async ({email_address, status, FNAME, LNAME, ZIPCODE, setStatus}) => {
  // NOTE: run site with netlify dev if there were any changes to subscribe.js
  const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/' : '/'
  const url = `${uri}api/subscribe`
  const data = {
    email_address,
    status,
    FNAME,
    LNAME,
    ZIPCODE
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('res', res)
    if (res.status === 200) {
      console.log('success')
      setStatus('success')

    } else if (res.status === 400) {
      setStatus('failure')
      console.log('400 status, acct already exists?')
    } else {
      console.error('subscribe.js failure')
      setStatus('failure')
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const MailChimp = () => {
  const [FNAME, setFName] = useState('')
  const [LNAME, setLName] = useState('')
  const [status, setStatus] = useState('')
  const [ZIPCODE, setZip] = useState('')
  const [email_address, setEmail] = useState('')
  const statusText = status === 'success' ? 'Success! You will be contacted by advocacy groups.' : 'I want to be contacted by advocacy groups'
  return (
    <div className="mailchimp container">
      <div className="mailchimp row">
        <input className="form-control" type="text" placeholder="First Name (optional)" onChange={e => setFName(e.target.value)} type="text" value={FNAME}/>
        <input className="form-control" type="text" placeholder="Last Name (optional)" onChange={e => setLName(e.target.value)} value={LNAME}/>
      </div>
      <div className="mailchimp row">
        <input className="form-control" style={{border: status === 'failure' ? '1px solid red' : ''}} type="email" placeholder="Email (required)" onChange={e => setEmail(e.target.value)} value={email_address}/>
        <input className="form-control" type="number" placeholder="Zip Code (optional)" onChange={e => setZip(e.target.value)} value={ZIPCODE}/>
      </div>
      {/* Clever way of avoiding bot form inputs */}
      <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
        <input type="text" name="b_b9c7524f0dc0712a8752cf555_66232ac6c7" tabIndex="-1" value=""/>
      </div>
      <small>{statusText}</small>
      {status !== 'success' &&
        <PrimaryButton onClick={() => {
          const subscriber = {
            FNAME,
            LNAME,
            email_address,
            ZIPCODE,
            status: 'subscribed',
            setStatus,
          }
          subscribe(subscriber)
        }}>
          Subscribe
        </PrimaryButton>
      }
    </div>
  )
}
                
export default MailChimp