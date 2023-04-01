const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function getTwoRandomChars() {
    const length = allowedChars.length;
    const randA = Math.floor(Math.random() * length);
    const randB = ((randA + Math.floor(Math.random() * length - 1)) % length) + 1;

    return [ allowedChars[randA], allowedChars[randB] ];
}
