export default {
  name: 'order',
  alias: ['payment', 'checkout', 'pay'],
  description: 'Send payment order button',
  category: 'owner',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      await sock.sendMessage(sender, {
        text: '✦ Order Details\n◉ Please complete your payment',
        footer: '✦ Sila Tech Shop',
        buttons: [
          {
            buttonId: 'review_and_pay',
            buttonText: { displayText: '💳 Pay Now' },
            type: 1,
            nativeFlowInfo: {
              name: 'review_and_pay',
              paramsJson: JSON.stringify({
                "currency": "TZS",
                "payment_configuration": "",
                "payment_type": "",
                "transaction_id": "",
                "total_amount": {
                  "value": 70000,
                  "offset": 100
                },
                "reference_id": "wxx",
                "order_request_id": "2063637e-5a38-446d-a25c-97bb68dfce02",
                "type": "digital-goods",
                "payment_method": "",
                "payment_status": "captured",
                "payment_timestamp": 1779974803,
                "order": {
                  "status": "shipped",
                  "description": "",
                  "subtotal": {
                    "value": 70000,
                    "offset": 100
                  },
                  "tax": {
                    "value": 8,
                    "offset": 100
                  },
                  "discount": {
                    "value": 6400,
                    "offset": 100
                  },
                  "shipping": {
                    "value": 4,
                    "offset": 100
                  },
                  "order_type": "ORDER",
                  "items": [
                    {
                      "retailer_id": "778739a4-e7b1-4295-9f29-ed3daec92a95",
                      "name": "Sila Tech Premium Bot",
                      "amount": {
                        "value": 70000,
                        "offset": 100
                      },
                      "quantity": 1
                    }
                  ]
                },
                "additional_note": "✦ Sila Tech Order",
                "native_payment_methods": [
                  "{\"name\":\"PIX\",\"enabled\":false}"
                ],
                "share_payment_status": true,
                "is_soft_deleted": false
              })
            }
          }
        ],
        headerType: 1,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true
        }
      }, { 
        quoted: msg,
        additionalNodes: [
          {
            tag: 'biz',
            attrs: {
              native_flow_name: 'order_details'
            }
          }
        ]
      });
      
    } catch (error) {
      console.error('[order]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};