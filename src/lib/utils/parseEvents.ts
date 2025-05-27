//export const parseJob = (event) => {
//  const tagMap = {}
//
//  for (const tag of event.tags) {
//    const [key, value] = tag
//    if (!tagMap[key]) {
//      tagMap[key] = []
//    }
//    tagMap[key].push(value)
//  }
//
//  return {
//    id: event.id,
//    pubkey: event.pubkey,
//    createdAt: new Date(event.created_at * 1000).toISOString(),
//    kind: event.kind,
//    title: tagMap.title?.[0] ?? '',
//    //summary: tagMap.summary?.[0] ?? '',
//    slug: tagMap.d?.[0] ?? '',
//    publishedAt: tagMap.published_at?.[0] 
//      ? new Date(Number(tagMap.published_at[0]) * 1000).toISOString()
//      : null,
//    location: tagMap.location?.[0] ?? '',
//    tags: tagMap.t ?? [],
//    content: event.content,
//    signature: event.sig
//  }
//}

export const parseJob = (event) => {
  const content = JSON.parse(event.content)
  const parsed = {
    id: event.id,
    pubkey: event.pubkey,
    createdAt: event.created_at,
    kind: event.kind,
    job: content.job,
    company: content.company,
    slug: null,
    tags: [],
    expiration: null,
  }

  for (const tag of event.tags) {
    const [type, value] = tag

    switch (type) {
      case 't':
        parsed.tags.push(value)
        break
      case 'd':
        parsed.slug = value
        break
      case 'expiration':
        parsed.expiration = value
        break
    }
  }

  console.log(parsed)

  return parsed
}
