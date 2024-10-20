import React from 'react';

interface KeyMapping {
  [key: string]: string;
}

export default function SetNote(
  key: string,
  note: string,
  keyMappings: KeyMapping,
  setKeyMappings: React.Dispatch<React.SetStateAction<KeyMapping>>
) {
  if (!keyMappings[note]) {
    setKeyMappings((prev) => ({
      ...prev,
      [note]: key,
    }));
  } else {
    keyMappings[note] = key;
  }
  console.log(keyMappings);
  return keyMappings;
}
