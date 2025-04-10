export function formatNumberSequence(sequence: string): string {
  const cleanedSequence = sequence.replace(/\D/g, "");

  const length = cleanedSequence.length;

  if (length < 4) {
    throw new Error("Sequence must contain at least 4 digits.");
  }

  let formattedString = "";

  const numSets = Math.floor((length - 4) / 4);
  for (let i = 0; i < numSets; i++) {
    formattedString += "xxxx-";
  }

  formattedString += cleanedSequence.slice(-4);

  return formattedString;
}
