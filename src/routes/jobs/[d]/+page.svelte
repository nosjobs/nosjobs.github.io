<script>
  import { onMount } from 'svelte'
  import { nip19 } from 'nostr-tools'
  import { marked } from 'marked'
  import DOMPurify from 'dompurify'
  import { page } from '$app/stores'
  import * as pool from '$lib/nostr/pool'
  import { parseJob } from '$lib/utils/parseEvents'
  import contracts from '$lib/data/contracts'
  import { formatUnixTimestamp } from '$lib/utils/formatUnixTimestamp'
  import { getTitle } from '$lib/utils/getTitle'
  import { nostrProfile } from '$lib/stores/nostr.js'

  let profile

  const unsubscribe = nostrProfile.subscribe(value => {
    profile = value
  })

  const naddr = nip19.decode($page.params.d)

  let author = {}
  let job = {}
  let company = {}
  let loading = true
  let error = ''

  marked.use({
    renderer: {
      link(content, title, text) {
        // Return the original Markdown link syntax as plain text instead of <a> tag
        console.log(content)
        return `${content.href}`
      }
    }
  })

  function unescapeMarkdown(str) {
    return str.replace(/\\n/g, '\n')
  }

  const fetchJob = async () => {
    const filter = { 
      '#d': [naddr.data.identifier],
      kinds: [naddr.data.kind],
      authors: [naddr.data.pubkey],
    }

    try {
      const event = await pool.get(filter)

      if (event) {
        loading = false
        const data = parseJob(event)
        data.job.publishedAt = formatUnixTimestamp(data.job.publishedAt)
        data.job.description = marked(DOMPurify.sanitize(data.job.description))
        job = { ...data.job }
        company = { ...data.company }
      }

      const metadata = await pool.get({
        kinds: [0],
        authors: [naddr.data.pubkey],
      })

      if (metadata) {
        author = JSON.parse(metadata.content)
      }
    } catch (err) {
      error = 'Error fetching jobs: ' + err.message
    }
  }

  onMount(() => {
    fetchJob()

    return () => unsubscribe()
  })
</script>

<main class="main">
  <div class="wrapper">
    <div class="job">
      <div class="job__cell job__cell--main">
        <header class="job__head">
          <div class="job-media">
            {#if company.website}
              <a href={company.website} target="_blank" class="job-media__img">
                <img src={company.image ? company.image : `/nosjobs100x100.svg`} alt={company.name} />
              </a>
            {:else}
              <div class="job-media__img">
                <img src={company.image ? company.image : `/nosjobs100x100.svg`} alt={company.name} />
              </div>
            {/if}
            <div class="job-media__body">
              <h1 class="job__title">
                {job.title}

                {#if company.name}
                  <span class="job__company">
                    na
                    <a href={company.website} target="_blank">{company.name}</a>
                  </span>
                {/if}
              </h1>

              {#if profile?.pubkey === naddr.data.pubkey}
                <a href={`/jobs/${$page.params.d}/edit`} class="btn btn--secondary">Editar</a>
              {/if}
            </div>
          </div>

          <ul class="job-info">
            <li>
              <div class={`badge badge--${job.contractType}`}>{getTitle(job.contractType, contracts)}</div>
            </li>
            <li>
              <img src="/local.svg" class="job__icon" alt="" />
              <div class="job__local">{job.location}</div>
            </li>
            <li>
              <img src="/calendar.svg" class="job__icon" alt="" />
              <div class="job__date">{job.publishedAt}</div>
            </li>
            <li>
              Publicado por: 
              <img src={author.picture} class="job__img" alt="" />
              <div class="job__date">{author.name || author.display_name}</div>
            </li>
          </ul>
        </header>

        <div class="job__body">
          <!--ul class="job-social">
            <li>
              TWITTER
            </li>
            <li>
              FACEBOOK
            </li>
            <li>
              GOOGLE+
            </li>
          </ul-->

          <!--h5>Descrição do trabalho:</h5-->

          {@html job.description}

          <a 
            class="btn btn--medium btn--primary"
            href={job.applyLink}
          >
            Candidatar-se à vaga
          </a>
        </div>

        <!--footer class="job-foot">

          <form class="job-form" target="_self">
            <div class="job-form__head">
              <h6 class="job-form__title">Aplicar para {job.title} na COMPANY</h6>
            </div>
            <div class="job-form__body">
              <ul class="job-form__list">
                <li>
                  <label class="job-form__label">Email:</label>
                  <div class="job-form__field">
                    <input id="" class="job-form__input input input--full" type="email" placeholder="Email" name="" dir="auto" aria-label="Email: Precisa ser um endereço de e-mail válido" aria-required="true" required title="Precisa ser um endereço de e-mail válido" />
                  </div>
                </li>

                <li>
                  <label class="job-form__label">Nome:</label>
                  <div class="job-form__field job-form__field--name">
                    <div class="job-form__cell">
                      <input id="" class="job-form__input input input--full" type="text" placeholder="Nome" name="entry.1558225822" dir="auto" aria-label="Name: Precisa conter" aria-required="true" required pattern=".*.*" title="Precisa conter" />
                    </div>
                    <div class="job-form__cell">
                      <input id="" class="job-form__input input input--full" type="text" placeholder="Sobre nome" name="entry.713180040" dir="auto" aria-label="Last Name: Precisa conter" aria-required="true" required pattern=".*.*" title="Precisa conter" />
                    </div>
                  </div>
                </li>

                <li>
                  <label class="job-form__label">Links de Referência:</label>
                  <div class="job-form__field">
                    <textarea id="" class="job-form__input textarea textarea--full" name="entry.944889134" placeholder="Linkedin, myportfolio.com..." rows={1} dir="auto" aria-label="Reference Links: Precisa ter pelo menos 20 caracteres." aria-required="true" required></textarea>
                  </div>
                </li>

                <li>
                  <label class="job-form__label">
                    Apresentação<strong>*</strong>:
                  </label>
                  <div class="job-form__field">
                    <textarea id="" class="job-form__input textarea textarea--full" name="entry.1496250376" rows={5} dir="auto" aria-label="Cover Letter: Precisa ter pelo menos 100 caracteres." aria-required="true" required></textarea>
                  </div>
                </li>
              </ul>
            </div>

            <div class="job-action">
              <button class="job-action__btn btn btn--primary btn--medium" type="submit">Candidatar-se à vaga</button>
            </div>
          </form>
        </footer-->
      </div>
    </div>
  </div>
</main>
