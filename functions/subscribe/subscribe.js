// https://medium.com/@mattdgregg/netlify-dev-serverless-functions-mailchimp-subscribe-form-tutorial-28ffaa51ba99
const fetch = require('node-fetch'); 
const base64 = require('base-64'); 
exports.handler = async (event, context, callback) => { 
  const creds = `any:${process.env.MAILCHIMP_KEY}`;
  const headers = { 
    Accept: '*/*', 
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 200,
      headers,
      body: "This was not a POST request!"
    };
  }
  const errorGen = msg => {
    return { statusCode: 500, body: msg }; 
  };
  try {
    const { email_address, FNAME, LNAME, ZIPCODE, status } = JSON.parse(event.body);
    if (!email_address) { 
      return errorGen('Missing Email');
    } 
    const subscriber = { 
      email_address, 
      status: status ? status : 'subscribed',
      merge_fields: {
        FNAME,
        LNAME,
        ZIPCODE
      }
    }; 
    // console.log('process.env.MAILCHIMP_KEY', process.env.MAILCHIMP_KEY)
    const data_center = 'us4'
    const list_id = '66232ac6c7'
    const response = await fetch(`https://${data_center}.api.mailchimp.com/3.0/lists/${list_id}/members/`, { 
      method: 'POST', 
      headers: Object.assign({}, headers, { Authorization: `Basic ${base64.encode(creds)}` }),
      body: JSON.stringify(subscriber), 
    });
    const data = await response.json();
    if (!response.ok) { 
      // NOT res.status >= 200 && res.status < 300 
      return { 
        statusCode: data.status,
        headers, 
        body: data.detail
      }; 
    }
    const res = { 
      statusCode: 200, 
      headers,
      // body: JSON.stringify({ msg: "You've signed up to the mailing list!", detail: data, }), 
      body: 'success'
    };
    // console.log('res', res)
    return res
  } catch (err) { 
    console.log(err); // output to netlify function log 
    return { 
      statusCode: 500, 
      headers,
      body: JSON.stringify({ msg: err.message }),
    };
  } 
};