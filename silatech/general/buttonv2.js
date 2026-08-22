// silatech/buttonv2.js
export class ButtonV2 {
  constructor(sock) {
    this.sock = sock;
    this.buttons = [];
    this.sections = [];
  }

  addButton(text, id, type = 1) {
    this.buttons.push({
      buttonId: id,
      buttonText: { displayText: text },
      type: type
    });
    return this;
  }

  addRow(title, rows) {
    this.sections.push({
      title: title,
      rows: rows.map(row => ({
        title: row.title,
        description: row.description || '',
        id: row.id
      }))
    });
    return this;
  }

  async send(jid, options = {}) {
    try {
      // If we have sections, send as list
      if (this.sections.length > 0) {
        return await this.sock.sendMessage(jid, {
          text: options.text || '✦ Select an option:',
          footer: options.footer || '✦ Sila Tech Bot',
          list: {
            buttonText: options.buttonText || '☰ Menu',
            description: options.description || 'Select a category',
            sections: this.sections
          },
          contextInfo: options.contextInfo || {}
        });
      }

      // If we have buttons, send as buttons
      if (this.buttons.length > 0) {
        // Split buttons into rows of 3
        const buttonRows = [];
        for (let i = 0; i < this.buttons.length; i += 3) {
          buttonRows.push(this.buttons.slice(i, i + 3));
        }

        // Send first row
        const firstRow = buttonRows[0] || [];
        if (firstRow.length > 0) {
          await this.sock.sendMessage(jid, {
            text: options.text || '✦ Select an option:',
            footer: options.footer || '✦ Sila Tech Bot',
            buttons: firstRow,
            headerType: 1
          });
        }

        // Send remaining rows with delay
        for (let i = 1; i < buttonRows.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.sock.sendMessage(jid, {
            text: options.moreText || '✦ More options:',
            footer: options.footer || '✦ Sila Tech Bot',
            buttons: buttonRows[i],
            headerType: 1
          });
        }

        return true;
      }

      throw new Error('No buttons or sections added');

    } catch (error) {
      console.error('ButtonV2 send error:', error);
      throw error;
    }
  }

  // Native flow info method
  addNativeFlow(buttonText, buttonId, nativeFlowInfo) {
    this.buttons.push({
      buttonText: { displayText: buttonText },
      buttonId: buttonId,
      type: 1,
      nativeFlowInfo: nativeFlowInfo
    });
    return this;
  }

  // Single select flow
  addSingleSelect(buttonText, buttonId, title, sections) {
    return this.addNativeFlow(buttonText, buttonId, {
      name: "single_select",
      paramsJson: JSON.stringify({
        title: title,
        sections: sections
      })
    });
  }
}

export default ButtonV2;