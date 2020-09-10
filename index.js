class CrossZero {
  constructor(domItem) {
    this.cells = [],
      this.whoseTurn = new Boolean(),
      this.aiSymbol = null,
      this.playerSymbol = null,
      this.gameStep = null,
      this.table = domItem,
      this.winArray = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
      this.startBtn = document.createElement('button'),
      this.playerSymbolBtn = {
        cross: document.createElement('button'),
        zero: document.createElement('button')
      },
      this.playerFirstBtn = {
        first: document.createElement('button'),
        last: document.createElement('button')
      },
      this.gameRound = 0
  }

  // инициализация приложения
  init() {
    this.gameStep = 'Start';
    this.render();
    this.Endgame = false;
    this.startBtn.className = "btn";
    this.startBtn.innerHTML = "Start";
    this.playerSymbolBtn.cross.className = "btn";
    this.playerSymbolBtn.cross.innerHTML = "Играть Крестиками";
    this.playerSymbolBtn.zero.className = "btn";
    this.playerSymbolBtn.zero.innerHTML = "Играть Ноликами";
    this.playerFirstBtn.first.className = "btn";
    this.playerFirstBtn.first.innerHTML = "Ходить первым";
    this.playerFirstBtn.last.className = "btn";
    this.playerFirstBtn.last.innerHTML = "Ходить вторым";
    this.clickEvent();
  }

  clickEvent() {
    this.table.addEventListener("click", (e) => {
      let item = e.target;
      if (item === this.startBtn) {
        this.cells = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.gameStep = 'OptionFirst';
        this.render()
      }
      // обработчики выбора игрового символа
      if (item === this.playerSymbolBtn.cross) {
        this.playerSymbol = "X";
        this.aiSymbol = "O";
        this.gameStep = 'OptionLast';
        this.render()
      }
      if (item === this.playerSymbolBtn.zero) {
        this.playerSymbol = "O";
        this.aiSymbol = "X";
        this.gameStep = 'OptionLast';
        this.render()
      }
      // обработчики выбора первого хода
      if (item === this.playerFirstBtn.first) {
        this.whoseTurn = true;
        this.gameStep = 'Game';
        this.render()
      }
      if (item === this.playerFirstBtn.last) {
        this.whoseTurn = false;
        this.gameStep = 'Game';
        this.render()
        this.aiTurn()
      }
      // обработчик хода игрока
      if (this.gameStep === 'Game' && !item.innerHTML && this.whoseTurn) {
        this.playersTurn(item.dataset.number)
      }
    })
  }

  // функция проверки победителя
  isGameFinish() {
    this.gameRound++;
    this.render()
    // откладываю выполнение чтобы не было проблем с рендерингом, возможно есть решение лучше
    setTimeout(() => {

      // определяем для кого проводится проверка
      let checkingSymbol = 3;
      let alertInfo = "Победил игрок"
      if (!this.whoseTurn) {checkingSymbol = -3; alertInfo = "Победил компьютер" }
      // проверка на победу
      for (var i = 0; i < this.winArray.length; i++) {
        if (this.cells[this.winArray[i][0]] + this.cells[this.winArray[i][1]] + this.cells[this.winArray[i][2]] === checkingSymbol) {
          alert(alertInfo);
          window.location.reload();
          return false
        }
      }
      // Ничья
      if (this.gameRound === 9) {
        alert("Ничья");
        window.location.reload();
        return false
      }
      // смена игрок/ai и следующий ход
      this.whoseTurn = !(this.whoseTurn);
      this.aiTurn()
    }, 200);
  }

  // ход игрока
  playersTurn(itemIndex) {
    this.cells[itemIndex] = 1;
    this.isGameFinish()
  }

  // обдуманный ход AI
  aiCheck(char) {
    let exitFlag = false;
    for (var i = 0; i < this.winArray.length; i++) {
      if (exitFlag == false) {
        if (this.cells[this.winArray[i][0]] === char && this.cells[this.winArray[i][1]] === char && this.cells[this.winArray[i][2]] === 0) {
          this.cells[this.winArray[i][2]] = -1;
          exitFlag = true;
        }
      }

      if (exitFlag == false) {
        if (this.cells[this.winArray[i][0]] === char && this.cells[this.winArray[i][1]] === 0 && this.cells[this.winArray[i][2]] === char) {
          this.cells[this.winArray[i][1]] = -1;
          exitFlag = true;
        }
      }
      if (exitFlag == false) {
        if (this.cells[this.winArray[i][0]] === 0 && this.cells[this.winArray[i][1]] === char && this.cells[this.winArray[i][2]] === char) {
          this.cells[this.winArray[i][0]] = -1;
          exitFlag = true;
        }
      }
      if (exitFlag) break;
    }
    return !exitFlag;
  }

  // случайный ход AI
  randomTurn () {
    let flag = false;
    while (!flag) {
      let randNum = Math.round((Math.random() * (9 - 1) + 1));
      if (this.cells[randNum] === 0) {
        this.cells[randNum] = -1
        flag = true;
        return true;
      }
    }
  }

  // ход компьютера
  aiTurn() {
    if (!this.whoseTurn) {
      // проверка своих ходов - для победы
      if (this.aiCheck(-1)) {
        // проверка ходов Игрока - для предотвращения победы игрока
        if (this.aiCheck(1)) {
          // рандомный ход - если не один из проверочных сценариев не сработал
          this.randomTurn()
        }
      }
      this.isGameFinish()
    }
    
  }

  // Рендер приложения, с проверкой на каком этапе мы находимся
  render() {
    this.table.innerHTML = '';
    if (this.gameStep === 'Start') {
      this.table.appendChild(this.startBtn);
    }
    if (this.gameStep === 'OptionFirst') {
      this.table.appendChild(this.playerSymbolBtn.cross);
      this.table.appendChild(this.playerSymbolBtn.zero);
    }
    if (this.gameStep === 'OptionLast') {
      this.table.appendChild(this.playerFirstBtn.first)
      this.table.appendChild(this.playerFirstBtn.last);
    }
    if (this.gameStep === 'Game') {
      let tableHtml = '';
      this.cells.forEach((item, itemNUmber) => {
        tableHtml += `<div class="cell" data-number="${itemNUmber}">${item === 0 ? "" : item === 1 ? `<span>${this.playerSymbol}</span>` : `<span>${this.aiSymbol}</span>`}</div>`
      });
      this.table.innerHTML = tableHtml;
    }
  }
}

let game = new CrossZero(document.getElementById('cross-zero'));

document.addEventListener('DOMContentLoaded', game.init())