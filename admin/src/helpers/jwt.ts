export interface Token {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    id: number;
  }
  
  function parseJWT(token: string) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }
  
  export function decodedJWT(session: string | any) {
    const res = parseJWT(session);
    return res;
  }
  