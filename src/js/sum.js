export default function sum (...args) {
  return args.reduce((p, c) => p + c, 0)
}

export function mul (x, y) {
  return x * y
}
