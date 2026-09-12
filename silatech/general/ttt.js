// Game session storage
const sessions = new Map();

export default {
  name: 'ttt',
  alias: ['tictactoe'],
  description: 'Play Tic Tac Toe text game',
  category: 'games',

  async execute(sock, msg, args, prefix) {
    const sender = msg.key.remoteJid;
    const input = args[0]; // Mfano: 1, 2, 3...

    let game = sessions.get(sender);

    if (!game || args[0] === 'reset') {
      // Inaload bodi mpya ya HTML-like logic (3x3 grid)
      game = { board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], turn: '❌' };
      sessions.set(sender, game);
    }

    if (input && !isNaN(input) && input >= 1 && input <= 9) {
      const pos = parseInt(input) - 1;
      if (game.board[pos] !== '❌' && game.board[pos] !== '⭕') {
        game.board[pos] = game.turn;
        game.turn = game.turn === '❌' ? '⭕' : '❌';
      }
    }

    // Render HTML-like UI kwa Emojis
    const renderBoard = 
      `🎮 *TIC-TAC-TOE GAME*\n\n` +
      ` ${game.board[0]} | ${game.board[1]} | ${game.board[2]} \n` +
      `---+---+---\n` +
      ` ${game.board[3]} | ${game.board[4]} | ${game.board[5]} \n` +
      `---+---+---\n` +
      ` ${game.board[6]} | ${game.board[7]} | ${game.board[8]} \n\n` +
      `Lượt ya: ${game.turn}\n` +
      `Jibu kwa: *${prefix}ttt [namba]* (mfano: ${prefix}ttt 5)`;

    await sock.sendMessage(sender, { text: renderBoard }, { quoted: msg });
  }
};