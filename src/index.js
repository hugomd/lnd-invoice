const express = require('express');
const axios = require('axios');
const https = require('https');
const qrcode = require('qrcode');

const {LND_IP, LND_PORT, MACAROON_BASE64} = process.env;

if (!LND_IP || !LND_PORT || !MACAROON_BASE64) {
  console.log(
    'LND_IP, LND_PORT, MACAROON_BASE64 are required environment variables',
  );
  process.exit(1);
}

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

(async () => {
  const app = express();
  const port = 8080;

  app.use('/', express.static(__dirname + '/public'));

  app.get('/invoice', async (req, res) => {
    const {
      query: {memo = '', value},
    } = req;

    if (!value) {
      res.send({error: 'value (sats) required'});
    }

    const {data: {payment_request}} = await instance({
      method: 'POST',
      url: `https://${LND_IP}:${LND_PORT}/v1/invoices`,
      headers: {
        'Grpc-Metadata-macaroon': MACAROON_BASE64,
      },
      data: {
        memo,
        value,
      },
    });

    const qr = await qrcode.toDataURL(payment_request);

    res.send({qr, payment_request});
  });

  app.listen(port, () => console.log(`Listening on port ${port}!`));
})();
