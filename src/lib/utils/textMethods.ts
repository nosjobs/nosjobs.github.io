export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')         // spaces to dashes
    .replace(/-+/g, '-')          // collapse multiple dashes
}

export const toHashtag = (text) => {
  return text
    .toLowerCase()
    .replace(/[-_]/g, ' ')                 // Replace dashes/underscores with space
    .trim()
    .split(/\s+/)                          // Split by whitespace
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
