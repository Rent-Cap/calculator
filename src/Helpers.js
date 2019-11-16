export function handleInput(key, event) {
  const obj = {}
  obj[key] = event.target.value
  this.setState(obj)
}