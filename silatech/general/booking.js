export default {
  name: 'booking',
  alias: ['book', 'reserve', 'appointment'],
  description: 'Send booking confirmation button',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      await sock.sendMessage(sender, {
        title: '✦ Booking Confirmation',
        body: 'https://fiora.nixel.my.id/',
        footer: '✦ Sila Tech',
        buttons: [
          {
            buttonId: 'booking_confirmation',
            buttonText: { displayText: '📅 Book Now' },
            type: 1,
            nativeFlowInfo: {
              name: 'booking_confirmation',
              paramsJson: JSON.stringify({
                "start_datetime": "2026-05-27T13:35:41.081Z",
                "end_datetime": "2026-05-27T13:45:41.081Z",
                "location": "Tanzania",
                "booking_url": "https://silatech.site",
                "phone_number": "255637351031",
                "booking_management_url": "https://silatech.site",
                "description": "✦ Sila Tech - WhatsApp Bot Development",
                "email": "silatech@example.com",
                "display_text": "✦ Book Your Appointment",
                "display_content": {
                  "display_language": "en",
                  "display_meeting_type": "✦ Consultation",
                  "display_bottom_sheet_header": "✦ Booking Details",
                  "display_add_to_calendar_cta_text": "✦ Add to Calendar",
                  "display_view_on_maps_cta_text": "✦ View on Map",
                  "display_manage_booking_cta_text": "✦ Manage Booking",
                  "display_manage_booking_not_supported_text": "✦ Booking management not supported",
                  "display_read_more": "✦ Read More"
                }
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
      }, { quoted: msg });
      
    } catch (error) {
      console.error('[booking]', error);
      await sock.sendMessage(sender, { 
        text: `✖ ${error?.message || error}` 
      });
    }
  }
};