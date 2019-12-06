import React, { useState } from 'react'
import './mailchimp.css'

const subscribe = async ({email_address, status, FNAME, LNAME, ZIPCODE}) => {
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
    } else if (res.status === 400) {
      console.log('acct already exists')
    } else {
      console.error('subscribe.js failure')
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

const MailChimp = () => {
  const [FNAME, setFName] = useState('')
  const [LNAME, setLName] = useState('')
  const [ZIPCODE, setZip] = useState('')
  const [email_address, setEmail] = useState('')
  return (
    <div>
      <div>
        <div>
          <label>First Name</label>
          <input type="text" onChange={e => setFName(e.target.value)} type="text" value={FNAME}/>
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" onChange={e => setLName(e.target.value)} value={LNAME}/>
        </div>
        <div>
          <label>Email Address</label>
          <input type="email" onChange={e => setEmail(e.target.value)} value={email_address}/>
        </div>
        <div>
          <label>Zip Code</label>
          <input type="number" onChange={e => setZip(e.target.value)} value={ZIPCODE}/>
        </div>
        <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true"><input type="text"
          name="b_b9c7524f0dc0712a8752cf555_66232ac6c7" tabIndex="-1" value=""/>
        </div>
        <button onClick={() => {
          const subscriber = {
            FNAME,
            LNAME,
            email_address,
            ZIPCODE,
            status: 'subscribed'
          }
          subscribe(subscriber)
        }}>
          Subscribe
        </button>
      </div>
    </div>
  )
}
                
export default MailChimp