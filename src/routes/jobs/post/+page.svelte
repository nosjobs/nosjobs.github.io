<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { nip19 } from 'nostr-tools'
  import DOMPurify from 'dompurify'
  import * as pool from '$lib/nostr/pool'
  import categories from '$lib/data/categories'
  import contracts from '$lib/data/contracts'
  import { slugify, toHashtag } from '$lib/utils/textMethods'
  import { nostrProfile } from '$lib/stores/nostr.js'

  let profile

  const unsubscribe = nostrProfile.subscribe(value => {
    profile = value
  })

  let job = {}
  let company = {}

  function addNewlines(text) {
    return text
      .split('\n')
      .map(line => line + '\\n')
      .join('\n')
  }

  const postJob = async () => {
    if (!profile) return alert('You need to be logged in.')
    if (!window.nostr) return alert('Nostr extension not found.')

    const pubkey = profile.pubkey
    const createdAt = Math.floor(Date.now() / 1000)

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const id = Array(12).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

    const now = new Date()
    now.setDate(now.getDate() + 90)
    const expiration = Math.floor(now.getTime() / 1000)

    job.description = DOMPurify.sanitize(job.description)
    job.publishedAt = String(createdAt)

    const event = {
      content: JSON.stringify({ job, company }),
      created_at: createdAt,
      pubkey,
      kind: 30600,
      tags: [
        ['d', `${slugify(job.title)}-${id}`],
        ['t', 'Job'],
        ['t', 'Work'],
        ['t', 'Employment'],
        ['t', job.category],
        ['t', toHashtag(job.contractType)],
        ['expiration', String(expiration)]
      ],
    }

    try {
      const signed = await window.nostr.signEvent(event)
      await Promise.any(pool.publish(signed))

      job = {}

      const naddr = nip19.naddrEncode({
        kind: signed.kind,
        pubkey: signed.pubkey,
        identifier: signed.tags.find(tag => tag[0] === 'd')[1],
      })

      goto(`/jobs/${naddr}`)
    } catch (error) {
      console.log(error)
    }
  }

  onMount(() => {
    return () => unsubscribe()
  })
</script>

<main class="main">
  <div class="wrapper">
    <div class="post">
      <header class="post__head">
        <h1 class="post__title">Postar Vaga</h1>
      </header>
      <div class="post__body">
        <form on:submit|preventDefault={postJob} method="POST" target="_self" class="post__cell post__cell--main">
          <h4 class="post__legend">Sobre a Empresa</h4>
          <ul class="post-form">
            <li>
              <label class="post-form__label">Nome da empresa:</label>
              <input type="text" bind:value={company.name} placeholder="Ex.: Blockstream" class="input input--full post-form__input" />
            </li>
            <li>
              <label class="post-form__label">Site da empresa:</label>
              <input type="url" bind:value={company.website} placeholder="https://example.com" class="input input--full post-form__input" />
            </li>
            <li>
              <label class="post-form__label">Logo:</label>
              <input type="url" bind:value={company.image} placeholder="https://example.com/image.jpg" class="input input--full post-form__input" />
              <div class="post-form__help">Optional: URL to an image with the company logo em 200x200.</div>
            </li>
          </ul>

          <h4 class="post__legend">Sobre a Vaga</h4>
          <ul class="post-form">
            <li>
              <label class="post-form__label">Título da vaga<strong>*</strong>:</label>
              <input type="text" bind:value={job.title} placeholder="Ex.: Desenvolvedor Nostr" class="input input--full post-form__input" required />
            </li>
            <!--li>
              <label class="post-form__label">Imagem de capa:</label>
              <input type="url" name="entry.1676493432" value="" placeholder="https://example.com/image.jpg" class="input input--full post-form__input" />
              <div class="post-form__help">
                Opcional: Envie a URL com uma imagem que represente a vaga
              </div>
            </li-->
            <!--li>
              <label class="post-form__label">Resumo da Vaga:<strong>*</strong></label>
              <input type="text" placeholder="Resumo em uma frase" bind:value={job.summary} class="input input--full post-form__input" required />
            </li-->
            <li>
              <label class="post-form__label">Local<strong>*</strong>:</label>
              <input type="text" bind:value={job.location} placeholder="Remoto ou em local específico" class="input input--full post-form__input" required />
            </li>
            <li>
              <label class="post-form__label">Categoria<strong>*</strong>:</label>
              <select bind:value={job.category} required class="input input--full post-form__input">
                <option value="" disabled selected hidden>Escolha uma opção...</option>
                {#each categories as item}
                  <option value={item.value}>{item.title}</option>
                {/each}
              </select>
            </li>
            <li>
              <label class="post-form__label">
                Tipo da vaga<strong>*</strong>:
              </label>
              <div class="post-form__input">
                <ul class="post-type-job">
                  {#each contracts as item}
                    <li>
                      <input 
                        bind:group={job.contractType}
                        type="radio"
                        id={item.value}
                        value={item.value}
                        class="post-type-job__input"
                        required
                      />
                      <label 
                        for={item.value}
                        class={`post-type-job__label badge badge--${item.value}`}
                      >
                        {item.title}
                      </label>
                    </li>
                  {/each}
                </ul>
              </div>
            </li>
            <li>
              <label for="description" class="post-form__label">
                Descrição da vaga<strong>*</strong>:
              </label>
              <textarea 
                id="description"
                bind:value={job.description}
                rows={8}
                placeholder="Descrição da vaga"
                class="textarea textarea--full"
                required
              ></textarea>
            </li>
            <li>
              <label class="post-form__label">Link ou e-mail:</label>
              <input 
                type="text"
                bind:value={job.applyLink}
                placeholder="Insira um e-mail ou link de aplicação"
                pattern="^((https?:\/\/)[^\s]+|[^\s@]+@[^\s@]+\.[^\s@]+)$"
                title="Digite um e-mail válido, URI mailto, ou URL (ex: voce@exemplo.com, mailto:voce@exemplo.com, ou https://seuportfólio.com)"
                class="input input--full post-form__input"
              />
            </li>
            <!--li>
              <label class="post-form__label">Tags:<strong>*</strong></label>
              <input type="text" name="" value="" placeholder="5 tags no máximo" class="input input--full post-form__input" required />
            </li-->
            <!--li>
              <label class="post-form__label">Salário ou Remuneração:<strong>*</strong></label>
              <input type="text" name="" value="" placeholder="" class="input input--full post-form__input" required />
            </li-->
          </ul>
          <div class="post-action">
            <button 
              type="submit"
              name="submit"
              class="post-action__btn btn btn--primary"
            >
              Enviar
            </button>
          </div>
        </form>
        <div class="post__cell post__cell--aside"></div>
      </div>
    </div>
  </div>
</main>
