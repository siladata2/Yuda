import { randomUUID } from 'crypto';

export default {
  name: 'portfolio',
  alias: ['porto', 'profile', 'silatech'],
  description: 'Display developer portfolio using A2UI',
  category: 'general',
  ownerOnly: false,
  
  async execute(sock, msg, args, prefix, options) {
    const sender = msg.key.remoteJid;
    
    try {
      const widgetUuid = randomUUID();
      
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
            text: "✦ Sila Tech"
          },
          nativeFlowMessage: {
            buttons: [
              {},
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  "display_text": "✦ GitHub",
                  "url": "https://github.com/Sila-Md",
                  "merchant_url": "https://github.com/Sila-Md"
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  "display_text": "✦ Contact",
                  "url": "https://wa.me/255637351031",
                  "merchant_url": "https://wa.me/255637351031"
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
                    "text": "✦ Sila Tech",
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
                    "url": "https://i.ibb.co/674988wP/silatech.jpg",
                    "variant": "header",
                    "fit": "none"
                  },
                  {
                    "id": "profile",
                    "component": "Text",
                    "text": "✦ WhatsApp Bot Developer\n◉ Specializing in Baileys & Node.js\n◉ Creating bots for communities",
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
                    "text": "Passionate developer focused on building advanced WhatsApp bots using Baileys framework. Expert in Node.js, JavaScript, and creating automation solutions.",
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
                    "text": "Advanced WhatsApp Bot with anti-systems, AI features, and interactive menus using Baileys.",
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
                    "text": "✦ Sila-MD Framework",
                    "variant": "h3"
                  },
                  {
                    "id": "project_2_description",
                    "component": "Text",
                    "text": "Open source WhatsApp Bot framework with modular architecture and extensive features.",
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
                    "text": "✦ A2UI Integration",
                    "variant": "h3"
                  },
                  {
                    "id": "project_3_description",
                    "component": "Text",
                    "text": "Interactive UI components for WhatsApp using AI Agent User Interface framework.",
                    "variant": "body"
                  },
                  {
                    "id": "contact",
                    "component": "Text",
                    "text": "Status: Active",
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
      
    } catch (error) {
      console.error('Portfolio error:', error);
      await sock.sendMessage(sender, { text: `✖ ${error?.message || error}` });
    }
  }
};