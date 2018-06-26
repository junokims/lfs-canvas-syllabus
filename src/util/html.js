const removeNewline = html => html.replace(/(?:^|<\/pre>)[^]*?(?:<pre>|$)/g, m => m.replace(/[\n\t]+/g, ''))
const findHref = html => {
  const matches = html.match(/href="([^"]*")/g)
  return matches
    ? matches.map(match => match.split(`\"`)[1])
    : []
}
const baseURL = 'ubc.beta.instructure.com' // 'canvas.ubc.ca'
const findCanvasHref = str => str.includes(baseURL)
const findCanvasLinks = matches => matches.filter(match => findCanvasHref(match))
const extractIDfromURL = url => Number(url.split('/files/')[1].split('/')[0])

module.exports = {
  removeNewline,
  findHref,
  findCanvasLinks,
  extractIDfromURL
}