let decoder = new TextDecoder("utf-8");

export function byteToString(buf: any) {
  return decoder.decode(buf);
}

export function deepCopy(object: any) {
  return JSON.parse(JSON.stringify(object));
}

export async function getJSONResponse(link: string) {
  let jsonResponse;
  try {
    const response = await fetch(link);
    jsonResponse = await response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
  return jsonResponse;
}

export function ID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "" + Math.random().toString(36).substr(2, 9);
}
