// https://medium.com/@mattdgregg/netlify-dev-serverless-functions-mailchimp-subscribe-form-tutorial-28ffaa51ba99
const fetch = require('node-fetch'); 
const base64 = require('base-64'); 
exports.handler = async (event, context) => { 
  // Only allow POST
  console.log('event', event)

  // if (event.httpMethod !== 'POST') { 
  //   return { statusCode: 405, body: 'Method Not Allowed' };
  // }
  const errorGen = msg => {
    return { statusCode: 500, body: msg }; 
  }; 
  try { 
    const { email_address, FNAME, LNAME, status } = JSON.parse(event.body);
    // if (!email) { 
    //   return errorGen('Missing Email');
    // } 
    const subscriber = { 
      email_address, 
      status,
      merge_fields: {
        FNAME,
        LNAME
      }
    }; 
    const creds = `any:${process.env.MAILCHIMP_KEY}`;
    // console.log('process.env.MAILCHIMP_KEY', process.env.MAILCHIMP_KEY)
    const data_center = 'us4'
    const list_id = '66232ac6c7'
    console.log('subscriber', subscriber)
    const response = await fetch(`https://${data_center}.api.mailchimp.com/3.0/lists/${list_id}/members/`, { 
      method: 'POST', 
      headers: { 
        Accept: '*/*', 
        'Content-Type': 'application/json', 
        // 'Access-Control-Allow-Origin': '*',
        Authorization: `Basic ${base64.encode(creds)}`, 
      }, 
      body: JSON.stringify(subscriber), 
    }); 
    const data = await response.json();
    console.log('data', data)
    if (!response.ok) { 
      // NOT res.status >= 200 && res.status < 300 
      return { statusCode: data.status, body: data.detail }; 
    }
    return { 
      statusCode: 200, 
      body: JSON.stringify({ msg: "You've signed up to the mailing list!", detail: data, }), 
    }; 
  } catch (err) { 
    console.log(err); // output to netlify function log 
    return { 
      statusCode: 500, 
      body: JSON.stringify({ msg: err.message }),
    };
  } 
};