// src/services/webQuestionsReader.js

// Funkcja pomocnicza do dekodowania tekstu (zastępuje bibliotekę windows-1250)
async function decodeFile(file) {
  const buffer = await file.arrayBuffer();
  // Najpierw próbujemy UTF-8
  const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
  try {
    return utf8Decoder.decode(buffer);
  } catch (e) {
    // Jeśli błąd, to znaczy że to stary plik CP1250 (Windows PL)
    const winDecoder = new TextDecoder('windows-1250');
    return winDecoder.decode(buffer);
  }
}

// Główna funkcja parsująca
export default {
  async parseUploadedFiles(fileList) {
    // Zamieniamy FileList na tablicę i filtrujemy tylko .txt
    const files = Array.from(fileList).filter(f => f.name.toLowerCase().endsWith('.txt'));
    
    const questionPromises = files.map(async (file) => {
      try {
        const text = await decodeFile(file);
        return getQuestionFromText(text, file.name);
      } catch (err) {
        console.error(`Błąd parsowania pliku ${file.name}:`, err);
        return null;
      }
    });

    const results = await Promise.all(questionPromises);
    return results.filter(q => q !== null);
  }
}

// --- Poniżej logika przepisana z oryginału (oczyszczona z zależności Node) ---

function getQuestionFromText(text, filename) {
  // Normalizacja końców linii (Windows CRLF -> LF)
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const firstLine = lines[0].trim();
  
  // Decyzja czy to pytanie typu X czy Y
  if (firstLine.startsWith('X')) {
    return readXQuestion(filename, lines);
  } else {
    return readYQuestion(filename, lines);
  }
}

function getLinkToImage(line) {
  // UWAGA: W wersji webowej to zwróci tylko nazwę pliku.
  // Wyświetlanie obrazków wymaga osobnej logiki (URL.createObjectURL)
  return line.split('[img]').pop().split('[/img]').shift();
}

function readXQuestion(filename, lines) {
  // Logika 1:1 z oryginału
  const correctAnswers = lines[0].trim().substring(1).split('').map((char, index) => {
    return { char: char, index: index }
  }).filter(i => i.char === '1').map(i => i.index);

  const questionType = lines[1].trim().startsWith('[img]') ? 'image' : 'text';
  const questionContent = questionType === 'image' ? getLinkToImage(lines[1]) : lines[1];

  const answers = lines.slice(2)
    .filter(l => l.trim().length !== 0)
    .map((line, index) => {
      line = line.trim();
      return {
        id: index,
        type: line.startsWith('[img]') ? 'image' : 'text',
        content: line.startsWith('[img]') ? getLinkToImage(line) : line,
        isCorrect: correctAnswers.includes(index)
      };
    });

  return {
    tag: filename, // Używamy nazwy pliku jako tagu/ID
    contentType: questionType,
    content: questionContent,
    type: 'single',
    answers: answers
  };
}

function getYQuestionContent(line) {
  // Logika 1:1 z oryginału
  const a = line.split(/({wybór [1-9][0-9]*})/);
  return a.map(l => {
    if (l.match(/{wybór [1-9][0-9]*}/)) {
      return {
        selectId: parseInt(l.replace('{wybór ', '').replace('}', '')) - 1,
        visibleContent: ''
      };
    } else {
      return l;
    }
  });
}

function readYQuestion(filename, lines) {
  // Logika 1:1 z oryginału
  const correctAnswersOfSelects = lines[0].trim().substring(2).split('').map(char => {
    return parseInt(char) - 1;
  });

  const questionType = lines[1].trim().startsWith('[img]') ? 'image' : 'text';
  const questionContent = getYQuestionContent(lines[1]);
  
  const answers = lines.slice(2)
    .filter(l => l.trim().length !== 0)
    .map((line, selectIndex) => {
      const options = line.trim().split(';;').filter(x => x);
      const correctOptionId = correctAnswersOfSelects[selectIndex];
      return {
        id: selectIndex,
        correctOptionId: correctOptionId,
        options: options.map((o, answerIndex) => {
          return {
            id: answerIndex,
            type: o.startsWith('[img]') ? 'image' : 'text',
            content: o.startsWith('[img]') ? getLinkToImage(o) : o,
            isCorrect: correctOptionId === answerIndex
          };
        })
      };
    });

  return {
    tag: filename,
    contentType: questionType,
    content: questionContent,
    type: 'select',
    answers: answers
  };
}