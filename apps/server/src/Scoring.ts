let correctSequence: string[] = [];
let noteIndex = 0;
let combo = 0;

function setNoteSequence(seq: string[]): void {
  correctSequence = seq;
  noteIndex = 0;
  UpdateCombo(false);
  return;
}

function UpdateCombo(isCorrectNote: boolean): void {
  if (!isCorrectNote) {
    combo = 0; // Reset combo if the answer is wrong
  } else {
    combo++; // Increment combo if the answer is correct
  }
  return;
}

function MoveNoteIndex(): void {
  noteIndex++;
  return;
}

function checkNoteSequence(input: string): {
  result: boolean;
  score: number;
  message: string;
  curIndex: number;
} {
  const correctAnswer = correctSequence[noteIndex];
  MoveNoteIndex();
  if (input === correctAnswer) {
    return {
      result: true,
      score: calculateScore(true),
      message: 'Correct NoteSequence, moving to the next one!',
      curIndex: noteIndex - 1,
    };
  } else {
    return {
      result: false,
      score: calculateScore(false),
      message: `Incorrect NoteSequence,Correct ans is ${correctAnswer} !`,
      curIndex: noteIndex - 1,
    };
  }
}

function calculateScore(isCorrectNote: boolean): number {
  UpdateCombo(isCorrectNote);
  if (!isCorrectNote) {
    return 0;
  }
  return 400 + 100 * combo;
}
