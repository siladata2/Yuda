import { randomUUID } from 'crypto';

export default {
  name: 'panda',
  alias: ['porto', 'profile', 'a2ui'],
  description: 'Display portfolio using A2UI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      // Generate unique UUID for widget
      const widgetUuid = randomUUID();
      
      // Build the A2UI message
      const content = {
        messageContextInfo: {
          messageSecret: "6dl5L3BxZ/haIDZtasZ9fcN4X+nGecLNbuiLh1slHLw="
        },
        interactiveMessage: {
          header: {
            hasMediaAttachment: false
          },
          body: {
            text: ""
          },
          footer: {
            text: "✦ Sila Tech Bot"
          },
          nativeFlowMessage: {
            buttons: [
              {},
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  "display_text": "✦ Portfolio",
                  "url": "https://github.com/itsliaaa",
                  "merchant_url": "https://github.com/itsliaaa"
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  "display_text": "✦ Contact",
                  "url": "https://wa.me/255636341031",
                  "merchant_url": "https://wa.me/255636341031"
                })
              }
            ],
            messageParamsJson: "{}",
            messageVersion: 1
          },
          bloksWidget: {
            uuid: widgetUuid,
            data: JSON.stringify({
              "version": "v0.9",
              "createSurface": {
                "surfaceId": `starcore-widget=${widgetUuid}`,
                "catalogId": "https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json",
                "components": [
                  {
                    "id": "root",
                    "component": "Column",
                    "children": [
                      "portfolio_header",
                      "profile_section",
                      "about_section",
                      "skills",
                      "projects_section",
                      "contact"
                    ]
                  },
                  {
                    "id": "portfolio_header",
                    "component": "Text",
                    "text": "✦ Sila Tech Portfolio",
                    "variant": "h1"
                  },
                  {
                    "id": "profile_section",
                    "component": "Column",
                    "children": [
                      "profile_image",
                      "profile"
                    ]
                  },
                  {
                    "id": "profile_image",
                    "component": "Image",
                    "url": "https://files.catbox.moe/ms64an.jpeg",
                    "variant": "header",
                    "fit": "none"
                  },
                  {
                    "id": "profile",
                    "component": "Text",
                    "text": "Sila Tech - WhatsApp Bot Developer dengan spesialisasi Baileys, Node.js, dan menciptakan bot interaktif untuk komunitas.",
                    "variant": "body"
                  },
                  {
                    "id": "about_section",
                    "component": "Column",
                    "children": [
                      "about",
                      "about_content"
                    ]
                  },
                  {
                    "id": "about",
                    "component": "Text",
                    "text": "◉ About Me",
                    "variant": "h2"
                  },
                  {
                    "id": "about_content",
                    "component": "Text",
                    "text": "Saya adalah developer WhatsApp Bot yang berfokus pada pembuatan bot dengan fitur canggih menggunakan Baileys. Keahlian utama saya adalah Node.js, JavaScript, dan pengembangan bot interaktif.",
                    "variant": "body"
                  },
                  {
                    "id": "skills",
                    "component": "Text",
                    "text": "✦ Skills: Node.js • Baileys • JavaScript • WhatsApp API • Bot Development • Automation",
                    "variant": "caption"
                  },
                  {
                    "id": "projects_section",
                    "component": "Column",
                    "children": [
                      "projects",
                      "project_1",
                      "project_2",
                      "project_3"
                    ]
                  },
                  {
                    "id": "projects",
                    "component": "Text",
                    "text": "◉ Projects",
                    "variant": "h2"
                  },
                  {
                    "id": "project_1",
                    "component": "Card",
                    "child": "project_1_content"
                  },
                  {
                    "id": "project_1_content",
                    "component": "Column",
                    "children": [
                      "project_1_title",
                      "project_1_description"
                    ]
                  },
                  {
                    "id": "project_1_title",
                    "component": "Text",
                    "text": "✦ Sila Tech Bot",
                    "variant": "h3"
                  },
                  {
                    "id": "project_1_description",
                    "component": "Text",
                    "text": "WhatsApp Bot full-featured dengan anti-systems, AI, dan interactive menus.",
                    "variant": "body"
                  },
                  {
                    "id": "project_2",
                    "component": "Card",
                    "child": "project_2_content"
                  },
                  {
                    "id": "project_2_content",
                    "component": "Column",
                    "children": [
                      "project_2_title",
                      "project_2_description"
                    ]
                  },
                  {
                    "id": "project_2_title",
                    "component": "Text",
                    "text": "✦ A2UI Framework",
                    "variant": "h3"
                  },
                  {
                    "id": "project_2_description",
                    "component": "Text",
                    "text": "Interactive UI framework for WhatsApp using AI Agent User Interface.",
                    "variant": "body"
                  },
                  {
                    "id": "project_3",
                    "component": "Card",
                    "child": "project_3_content"
                  },
                  {
                    "id": "project_3_content",
                    "component": "Column",
                    "children": [
                      "project_3_title",
                      "project_3_description"
                    ]
                  },
                  {
                    "id": "project_3_title",
                    "component": "Text",
                    "text": "✦ Community Bot",
                    "variant": "h3"
                  },
                  {
                    "id": "project_3_description",
                    "component": "Text",
                    "text": "Bot for community management with group features and auto-moderation.",
                    "variant": "body"
                  },
                  {
                    "id": "contact",
                    "component": "Text",
                    "text": "Status: Active • Location: Tanzania • Specialization: Bot Development",
                    "variant": "caption"
                  }
                ]
              }
            }),
            type: "im_a2ui"
          },
          contextInfo: {
            expiration: 7776000
          }
        }
      };
      
      // Send the message with additional nodes
      await sock.relayMessage(sender, content, {
        additionalNodes: [
          {
            tag: "biz",
            attrs: {},
            content: [
              {
                tag: "interactive",
                attrs: {
                  type: "native_flow",
                  v: "1"
                },
                content: [
                  {
                    tag: "native_flow",
                    attrs: {
                      v: "9",
                      name: "mixed"
                    }
                  }
                ]
              }
            ]
          }
        ]
      });
      
      // Send confirmation
      await sock.sendMessage(sender, {
        text: `✦ Portfolio sent successfully!\n◉ Widget ID: ${widgetUuid.substring(0, 8)}...`
      });
      
    } catch (error) {
      console.error('Portfolio error:', error);
      await sock.sendMessage(sender, {
        text: `✖ Failed to send portfolio: ${error.message}`
      });
    }
  }
};