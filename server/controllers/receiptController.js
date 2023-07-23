const Receipt = require('../models/receipt')
const stripe = require('stripe')(process.env.STRIPE_SK)
const PurchasedItems = require('../models/purchasedItems')
const Listing = require('../models/listings')
let nodemailer = require('nodemailer');

const endpointSecret = "whsec_e4721157de442a80782173949cfb8097105a13e7acdb18dc9eced827256eadec"

exports.createReceiptForm = async (req, res, next) => {
    try {
        res.send(`
        <form action='/receipts' method='POST' encType='multipart/form-data'>
        <input type='number' name='userId'>
        <input type='submit' value='Submit'>
        </form>
        `)
    } catch (err) {
        console.log(err)
    }
}

exports.createReceipt = async (req, res, next) => {
    console.log('hi')
    res.send('created')
    // let receipt;
    // let purchasedItems = []
    // let total;
    // let userId = req.body.userId
    // try {
    //     let [listingData, _] = await Cart.findItemsInCartByUserId(userId)
    //     total = getTotal(listingData);
    //     receipt = new Receipt(total, userId)
    //     await receipt.save()

    //     let createdReceipt = await Receipt.findLastReceiptMadeForUser(userId)
    //     createdReceipt = await createdReceipt[0][0]

    //     await listingData.forEach(listing => {
    //         let purchasedItem = new PurchasedItems(listing.id, createdReceipt.id, listing.price)
    //         purchasedItems.push(purchasedItem);
    //         purchasedItem.save()
    //     })

    //     await Cart.empty(userId)

    //     createdReceipt.items = purchasedItems
    //     res.json(createdReceipt)
    // } catch (err) {
    //     console.log(err)
    // }
}

exports.getReciptById = async (req, res, next) => {
    let id = req.params.id
    try {
        let [receipt, _] = await Receipt.findReceiptById(id)
        receipt = receipt[0]

        let purchasedItems = await PurchasedItems.findAllItemsByReceiptId(id)
        purchasedItems = purchasedItems[0]
        receipt.items = purchasedItems
        res.status(200).json(receipt)
    } catch (err) {
        console.log(err)
    }
}

exports.getAllReceiptsByOwnerId = async (req, res, next) => {
    let id = req.params.id
    try {
        let [receipts, _] = await Receipt.findAllReceiptsByOwnerId(id);

        res.status(200).json(receipts)
    } catch (err) {

    }
}

exports.createReceiptFromWebhook = (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const customerInfo = event.data.object;
        handleReceipt(customerInfo)
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.sendStatus(200);
}

const handleReceipt = async (session) => {
  let receiptId = await createReceipt(session)
  let receiptInfo = generateParsedURLData(session.success_url)
  let listingData = await archiveListings(receiptInfo.listingsBought, receiptId) 
  sendEmails(session.customer_details.email, listingData, session.amount_subtotal, session.amount_total)
} 

//Sample Object 
//{
//   id: 'cs_test_b1yWanVLifK079eFw9EpQzNVCEfJtOaf6AvZsA9UUkx82hmKSZaJbTWVXF',
//   object: 'checkout.session',
//   after_expiration: null,
//   allow_promotion_codes: null,
//   amount_subtotal: 1898,
//   amount_total: 2198,
//   automatic_tax: { enabled: false, status: null },
//   billing_address_collection: null,
//   cancel_url: 'http://localhost:3000/myCart',
//   client_reference_id: null,
//   consent: null,
//   consent_collection: null,
//   created: 1688154415,
//   currency: 'usd',
//   currency_conversion: null,
//   custom_fields: [],
//   custom_text: { shipping_address: null, submit: null },
//   customer: null,
//   customer_creation: 'if_required',
//   customer_details: {
//     address: {
//       city: 'Albuquerque',
//       country: 'US',
//       line1: '8431 Bella Vista Pl NW',
//       line2: null,
//       postal_code: '87120',
//       state: 'NM'
//     },
//     email: 'YSobioch@gmail.com',
//     name: 'Yuri Sobioch',
//     phone: null,
//     tax_exempt: 'none',
//     tax_ids: []
//   },
//   customer_email: null,
//   expires_at: 1688240815,
//   invoice: null,
//   invoice_creation: {
//     enabled: false,
//     invoice_data: {
//       account_tax_ids: null,
//       custom_fields: null,
//       description: null,
//       footer: null,
//       metadata: {},
//       rendering_options: null
//     }
//   },
//   livemode: false,
//   locale: null,
//   metadata: {},
//   mode: 'payment',
//   payment_intent: 'pi_3NOnHiHhbkZwDYte1G5cauyD',
//   payment_link: null,
//   payment_method_collection: 'always',
//   payment_method_options: {},
//   payment_method_types: [ 'card' ],
//   payment_status: 'paid',
//   phone_number_collection: { enabled: false },
//   recovered_from: null,
//   setup_intent: null,
//   shipping_address_collection: { allowed_countries: [ 'US' ] },
//   shipping_cost: {
//     amount_subtotal: 300,
//     amount_tax: 0,
//     amount_total: 300,
//     shipping_rate: 'shr_1NOnHPHhbkZwDYteq9DqO3Uj'
//   },
//   shipping_details: {
//     address: {
//       city: 'Albuquerque',
//       country: 'US',
//       line1: '8431 Bella Vista Pl NW',
//       line2: null,
//       postal_code: '87120',
//       state: 'NM'
//     },
//     name: 'Yuri Sobioch'
//   },
//   shipping_options: [
//     {
//       shipping_amount: 300,
//       shipping_rate: 'shr_1NOnHPHhbkZwDYteq9DqO3Uj'
//     }
//   ],
//   status: 'complete',
//   submit_type: null,
//   subscription: null,
//   success_url: 'http://localhost:3000/purchased/24,23/1',
//   total_details: { amount_discount: 0, amount_shipping: 300, amount_tax: 0 },
//   url: null
// }

const generateParsedURLData = (url)  => {
  const urlArr = [...url]

  let accountNum = "";
  let listingsBought = []

  for(let i = urlArr.length - 1; urlArr[i] !== '/'; i--) {
      let nextNum = urlArr.pop()
      accountNum = nextNum + accountNum
  }

  urlArr.pop()

  let runningNum = ""
  for(let i = urlArr.length - 1; urlArr[i] !== '/'; i--) {
      let nextNum = urlArr.pop()
      if(nextNum === ",") {
          listingsBought.push(Number(runningNum))
          runningNum = ""
          continue;
      }
      runningNum = nextNum + runningNum
  }
  listingsBought.push(Number(runningNum))

  return {accountNumber: Number(accountNum), listingsBought: listingsBought}
}

const archiveListings = async (listingArr, receiptId) => {
  let listingData = await Promise.all(listingArr.map(async (id) => {
    let [listingInfo] = await Listing.findById(id)
    listingInfo = listingInfo[0];
    Receipt.archiveListing(listingInfo.id, listingInfo.name, listingInfo.price, receiptId)
    Listing.deleteListing(id)
    return listingInfo
  }))
  return listingData
}

const createReceipt = async (session) => {
  let newReciept = new Receipt(Number(session.amount_total), Number(session.success_url.slice(-1)), session.customer_details.email, session.payment_status);
  let created = await newReciept.save()
  
  return created[0].insertId
}

const sendEmails = (emailAddress, listings, subtotal, total) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'craftybeedesignco@gmail.com',
      pass: 'sbluwjgmzixxdfvj'
    }
  });

  let mailOptions = {
    from: 'craftybeedesignco@gmail.com',
    to: emailAddress,
    subject: 'ORDER RECIEVED',
    html: `
    <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="600" style="border-top-left-radius:16px;border-top-right-radius:16px;margin:0 auto;min-width:600px">
    <tbody>
      <tr>
        <td style="border:0;margin:0;padding:0">
          

<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td align="center" height="0" style="border:0;margin:0;padding:0;color:#ffffff;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
<span style="color:#ffffff;text-decoration:none">


Receipt from Crafty Bee [#1717-2128] Amount paid $21.98 Date paid Jun 30, 2023, 1:30:20 PM



‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌<wbr>&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;


</span>
</td>
</tr>
</tbody>
</table>


<div style="background-color:#f6f9fc;padding-top:20px">
<table dir="ltr" width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff">
<tbody>
<tr>
<td style="background-color:#8ccdb0;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-left-radius:5px" align="right" height="156" valign="bottom" width="252">
<a href="https://59.email.stripe.com/CL0/https:%2F%2Flinktr.ee%2Fthecraftybeedesignco/1/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/dI3YAO88077tQuTLaL8Nu_Kui9WPw7Bq0aCxp_dZx80=307" style="outline:0;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://59.email.stripe.com/CL0/https:%252F%252Flinktr.ee%252Fthecraftybeedesignco/1/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/dI3YAO88077tQuTLaL8Nu_Kui9WPw7Bq0aCxp_dZx80%3D307&amp;source=gmail&amp;ust=1688369316026000&amp;usg=AOvVaw3kdZxp-KwM2lyTeaVIqII8">
  <img alt="" height="156" width="252" src="https://ci4.googleusercontent.com/proxy/9-vzO6oIjzdWLz5vxJipUa48-_jdteSGmZPi_jXjI1P9gfsxKXGx5ZC6HCp7gEsdL6c6qVHcVmPrfRVxxz7Yw1GWRX10g1zsI66f3vStuGoBVesH24A0bVJsUdvql3xAbjPcKaA_8g=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Left.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd" data-bit="iit">
</a>
</td>
<td style="background-color:#8ccdb0;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;width:96px!important" align="center" height="156" valign="bottom">
<a href="https://59.email.stripe.com/CL0/https:%2F%2Flinktr.ee%2Fthecraftybeedesignco/2/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/cZ1vDNLtbEolborSzdOF9rv1WhzJWNz1sE32rkNdy5A=307" style="outline:0;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://59.email.stripe.com/CL0/https:%252F%252Flinktr.ee%252Fthecraftybeedesignco/2/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/cZ1vDNLtbEolborSzdOF9rv1WhzJWNz1sE32rkNdy5A%3D307&amp;source=gmail&amp;ust=1688369316026000&amp;usg=AOvVaw2oBiwgtZVkRm4el8b1uiSU">
<img alt="" height="156" width="96" src="https://ci6.googleusercontent.com/proxy/PMjWbntgDa6JjC4hbnOlKj3GgYe07y0lGIeMF7N1sWocbXk6obg1_9C4Nx6y0ko4JNsaJUEmEFFskodGcY-2XAJbsKncJrNW1P7HAm2MYiYDGOtKCA92BLXAOEVq41G5EC8Lalq6BBba1vSrsEcZ_fBe=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/emails/acct_1NMPfYHhbkZwDYte/2/twelve_degree_icon@2x.png" style="display:block;border:0;line-height:100%" class="CToWUd" data-bit="iit">
</a>
</td>
<td style="background-color:#8ccdb0;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-right-radius:5px" align="left" height="156" valign="bottom" width="252">
<a href="https://59.email.stripe.com/CL0/https:%2F%2Flinktr.ee%2Fthecraftybeedesignco/3/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/O8_4lf47gyKA2dCQAK9pz1gWXFK_jkREIMIfHugzLb0=307" style="outline:0;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://59.email.stripe.com/CL0/https:%252F%252Flinktr.ee%252Fthecraftybeedesignco/3/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/O8_4lf47gyKA2dCQAK9pz1gWXFK_jkREIMIfHugzLb0%3D307&amp;source=gmail&amp;ust=1688369316026000&amp;usg=AOvVaw1gE9inj-K-kMhJPYcszdSb">
  <img alt="" height="156" width="252" src="https://ci5.googleusercontent.com/proxy/agqjJXCE9UqmeYtipoZMl4NQ5plhy-TKT_WsqxR18QMhNXU7t-dJPtqpaqwtjzrOslBvOe18-HlXRVknnUuUTIhtrECzchPqX06DXBwznI7p5hMwQb0pIl-d9gWCXjLTWHpQSf0rxKo=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Right.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd" data-bit="iit">
</a>
</td>
</tr>
</tbody>
</table>
</div>
<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td align="center" style="border:0;border-collapse:collapse;margin:0;padding:0;width:472px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#32325d;font-size:24px;line-height:32px">
Receipt from Crafty Bee
</td>
</tr>
<tr>
<td colspan="3" height="12" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>



<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td height="20" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>





<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td colspan="3" height="8" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>

<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td colspan="3" height="8" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>
<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td colspan="3" height="24" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>
<td style="border:0;margin:0;padding:0">
<table bgcolor="#f6f9fc" border="0" cellpadding="0" cellspacing="0" style="border-radius:8px" width="100%">
<tbody>

<tr>
<td style="border:0;margin:0;padding:0">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
<tbody>
<tr>
<td colspan="3" height="12" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="16">
<div>&nbsp;</div>
</td>
<td style="border:0;margin:0;padding:0;color:#414552;font-family:-apple-system,'SF Pro Display','SF Pro Text','Helvetica',sans-serif;font-size:16px;line-height:24px">


<table style="padding-left:5px;padding-right:5px" width="100%">
<tbody><tr>
<td>


</td>
</tr>
${listings.map(listing => {
  return (`
    <tr>
      <td style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px;width:100%">
      ${listing.name}
      </td>
      <td width="8" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
      <td align="right" valign="top" style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px">
      ${(listing.price / 100).toFixed(2)}
      </td>
    </tr>
    <tr>
    <td colspan="3" height="6" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
    </tr>
    `
  )
}).join('')}

<tr>
<td colspan="3" height="6" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>

<tr>
<td bgcolor="e6ebf1" colspan="3" height="1" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>

<tr>
<td colspan="3" height="8" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>
<tr>
<td style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px;width:100%">
Subtotal
</td>
<td width="8" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
<td align="right" valign="top" style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px">
$${(subtotal / 100).toFixed(2)}
</td>
</tr>
<tr>
<td colspan="3" height="6" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>
<tr>
<td style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px;width:100%">
Shipping
</td>
<td width="8" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
<td align="right" valign="top" style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px">
$3.00
</td>
</tr>
<tr>
<td colspan="3" height="6" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>

<tr>
<td style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px;width:100%">
<strong>Amount charged</strong>
</td>
<td width="8" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
<td align="right" valign="top" style="border:0;border-collapse:collapse;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif;vertical-align:middle;color:#525f7f;font-size:15px;line-height:24px">
<strong>$${(total / 100).toFixed(2)}</strong>
</td>
</tr>
<tr>
<td colspan="3" height="6" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td>
</tr>






</tbody></table>


</td>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="16">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td colspan="3" height="12" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>

</tbody>
</table>
</td>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td colspan="3" height="24" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>


<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td colspan="3" height="24" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px" width="48">
<div>&nbsp;</div>
</td>
<td bgcolor="#e6ebf1" height="1" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px">
<div>&nbsp;</div>
</td>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px" width="48">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td colspan="3" height="24" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px;max-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>

<table border="0" cellpadding="0" cellspacing="0" width="600" style="min-width:600px">
<tbody>
<tr>
<td colspan="3" height="8" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>
<td style="border:0;margin:0;padding:0;color:#414552!important;font-family:-apple-system,'SF Pro Display','SF Pro Text','Helvetica',sans-serif;font-weight:400;font-size:16px;line-height:24px">

If you have any questions, contact us at <a style="border:0;margin:0;padding:0;color:#625afa!important;font-weight:bold;text-decoration:none" href="mailto:craftybeedesignco@gmail.com" target="_blank">craftybeedesignco@gmail.com</a> or call at <a style="border:0;margin:0;padding:0;color:#625afa!important;font-weight:bold;text-decoration:none" href="http://59.email.stripe.com/CL0/tel:%2B15056599686/1/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/seK8Mj7oqBg8tss0MFv5qVhBlZimOpkS0Qz3mEs3RmM=307" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://59.email.stripe.com/CL0/tel:%252B15056599686/1/010101890dce05e0-f8862d97-dff5-4568-bc0b-efb869217d92-000000/seK8Mj7oqBg8tss0MFv5qVhBlZimOpkS0Qz3mEs3RmM%3D307&amp;source=gmail&amp;ust=1688369316026000&amp;usg=AOvVaw0PPoUUZmvPwgKFQD325HKL">+1 505-659-9686</a>.

</td>
<td style="border:0;margin:0;padding:0;font-size:1px;line-height:1px" width="48">
<div>&nbsp;</div>
</td>
</tr>
<tr>
<td colspan="3" height="8" style="border:0;margin:0;padding:0;font-size:1px;line-height:1px">
<div>&nbsp;</div>
</td>
</tr>
</tbody>
</table>






<table width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff"><tbody><tr><td height="20" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td></tr></tbody></table>


<table width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff;border-bottom-left-radius:5px;border-bottom-right-radius:5px"><tbody><tr><td height="64" style="border:0;border-collapse:collapse;margin:0;padding:0;color:#ffffff;font-size:1px;line-height:1px">&nbsp;</td></tr></tbody></table>
        </td>
      </tr>
      </tbody>
  </table>
      `
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}