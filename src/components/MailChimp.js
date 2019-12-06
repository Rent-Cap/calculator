import React, { useState } from 'react'
import './mailchimp.css'

const subscribe = async user => {
  // audience id
  // 66232ac6c7
  // api key
  // ...-us4
  // url
  // https://us4.api.mailchimp.com/3.0/
  // to add a member, post to:
  // lists/66232ac6c7/members/
  // const apiKey = '...-us4'
  // const url = 'https://us4.api.mailchimp.com/3.0/lists/66232ac6c7/members/';

  // NOTE: run site with netlify dev
  const uri = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/' : '/'
  const url = `${uri}api/subscribe`
  const data = {
    "email_address": "bbbaaabbburist.mcvanasdfkddab@freddiesjokes.com",
    "status": "subscribed",
    "FNAME": "bbbaaabbbaaaUriewfst2",
    "LNAME": "bbbMcVanddkab"
  }

  try {
    const response = await fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `apikey ${apiKey}`
      }
    });
    const json = await response;
    console.log('json', json)
    // console.log('Success:', JSON.stringify(json));
  } catch (error) {
    console.error('Error:', error);
  }
}

const MailChimp = () => {
  const [name, setName] = useState('')
  return (
    <div id="mc_embed_signup">
      {/* <form action="https://gmail.us4.list-manage.com/subscribe/post?u=b9c7524f0dc0712a8752cf555&amp;id=66232ac6c7"
        method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank"
        novalidate> */}
      <div id="mc_embed_signup_scroll">
        <h2>Subscribe</h2>
        <div class="indicates-required">
          <span class="asterisk">*</span> 
          indicates required
        </div>
        <div class="mc-field-group">
          <label for="mce-FNAME">First Name </label>
          <input onChange={e => setName(e.target.value)} type="text" value={name} name="FNAME" class="" id="mce-FNAME"/>
        </div>
        <div class="mc-field-group">
          <label for="mce-LNAME">Last Name </label>
          <input type="text" value="" name="LNAME" class="" id="mce-LNAME"/>
        </div>
        <div class="mc-field-group">
          <label for="mce-EMAIL">Email Address <span class="asterisk">*</span>
          </label>
          <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL"/>
        </div>
        <div id="mce-responses" class="clear">
          <div class="response" id="mce-error-response" style={{display:"none"}}></div>
          <div class="response" id="mce-success-response" style={{display:"none"}}></div>
        </div>
        {/* <div style={{position: "absolute", left: "-5000px;"}} aria-hidden="true"><input type="text"
            name="b_b9c7524f0dc0712a8752cf555_66232ac6c7" tabindex="-1" value=""/>
            </div> */}
        <div onClick={() => subscribe()} class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe"
            class="button"/>
              
        </div>
      </div>
      {/* </form> */}
    </div>
  )
}
                
export default MailChimp