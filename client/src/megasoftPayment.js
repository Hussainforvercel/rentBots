import express from 'express';

const router = express.Router();

router.post('/api/pay-with-megasoft', async (req, res) => {
  try {
    const {
      amount,
      cod_afiliacion,      
      factura,             
      pan,                
      cvv2,                
      cid,                
      expdate,           
      client              
    } = req.body;

    const control = Date.now()
    const xmlBody = `
      <request>
        <cod_afiliacion>${cod_afiliacion}</cod_afiliacion>
        <control>${control}</control>
        <transcode>0141</transcode>
        <pan>${pan}</pan>
        <cvv2>${cvv2}</cvv2>
        <cid>${cid}</cid>
        <expdate>${expdate}</expdate>
        <amount>${amount}</amount>
        <client>${client}</client>
        <factura>${factura}</factura>
      </request>
    `.trim();

    const response = await axios.post('https://paytest.megasofthttps://github.com/Saif-Arshad/devfolio/pull/41.com.ve/payment/action/v2-procesar-compra', xmlBody, {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': 'Basic YWRhc2lsdmE6TTNnYXNvZnQh'
      },
      timeout: 10000 // 10 seconds timeout
    });

    // Return the raw XML or parse it if needed
    res.status(200).send(response.data);

  } catch (error) {
    console.error("Megasoft payment error:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Megasoft payment failed.' });
  }
});

export default router;
