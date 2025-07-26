import _ from "lodash";

const extractJSON = (text) => {
  const patterns = [
    /```json\s*([\s\S]*?)\s*```/,
    /```\s*([\s\S]*?)\s*```/,
    /{[\s\S]*}/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const jsonStr = match[1]?.trim() || match[0].trim();
        JSON.parse(jsonStr);
        return jsonStr;
      } catch (e) {
        continue;
      }
    }
  }
  return null;
};

// ['a', 'b'] = {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export { extractJSON, getSelectData, unGetSelectData };
