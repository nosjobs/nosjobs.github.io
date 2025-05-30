<script>
	//let lang = $props();
  export let data;

  import { onMount } from 'svelte'
  import { base } from '$app/paths'
  import { nip19 } from 'nostr-tools'
  import { parseJob } from '$lib/utils/parseEvents'
  import * as pool from '$lib/nostr/pool'
  import contracts from '$lib/data/contracts'
  import { formatUnixTimestamp } from '$lib/utils/formatUnixTimestamp'
  import { getTitle } from '$lib/utils/getTitle'
  import { toHashtag } from '$lib/utils/textMethods'

  let jobs = []
  let contractsOptions = contracts.map(item => toHashtag(item.value))
  let loading = true
  let error = ''

  const fetchJobs = async () => {
    const filters = { 
      kinds: [30600],
      //limit: 10,
      '#t': contractsOptions,
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const events = await pool.querySync(filters)

      if (events.length > 0) {
        loading = false
        for (const event of events) {
          const data = parseJob(event)

          data.job.publishedAt = formatUnixTimestamp(data.job.publishedAt)

          data.naddr = nip19.naddrEncode({
            kind: data.kind,
            pubkey: data.pubkey,
            identifier: data.slug,
          })

          jobs = [...jobs, { ...data }]
        }
      } else {
        loading = false
      }
      
    } catch (err) {
      error = 'Error fetching jobs: ' + err.message
    }
  }

  function handleChange() {
    loading = true
    jobs = []
    fetchJobs()
  }

  onMount(() => {
    fetchJobs()
  })
</script>

<main class="main">
  <div class="explore">
    <div class="wrapper">
      <header class="explore__head">
        <h1 class="explore-title">
          Conectando talentos e oportunidades<br />
          <span class="explore-title__normal"> no universo Bitcoin</span>
        </h1>
      </header>

      <div class="explore__body">
        <div class="explore__cell explore__cell--main">
          <!--div class="search">
            <input class="search__input" name="" type="text" ng-model="filter" placeholder='Buscar Vaga, Empresas, Locais...' />
            <a class="search__btn btn">Buscar</a>
          </div-->

          <div class="typejob">
            <ul class="typejob__list">
              {#each contracts as item}
                <li>
                  <input 
                    type="checkbox"
                    id={item.value}
                    value={toHashtag(item.value)}
                    class="post-type-job__input"
                    bind:group={contractsOptions}
                    on:change={handleChange}
                    disabled={loading}
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

          {#if loading}
            <p class="loading">Loading your jobs...</p>
          {:else if error}
            <p class="error">{error}</p>
          {:else if jobs.length === 0}
            <p>No jobs found.</p>
          {:else}
            <ul class="jobs">
              {#each jobs as item}
                <li>
                  <a class="jobs-item" href={`${base}/jobs/${item.naddr}`} title="">
                    <div class="jobs-item__cell jobs-item__cell--img">
                      <img class="jobs-item__img" src={item.company.image ? item.company.image : `/nosjobs100x100.svg`} alt="" />
                    </div>
                    <div class="jobs-item__cell jobs-item__cell--body">
                      <h2 class="jobs-item__title">{item.job.title}</h2>
                      <h3 class="jobs-item__company">
                        {#if item?.company.name}
                          {item.company.name} -
                        {/if}
                        {item.job.location}
                      </h3>
                    </div>
                    <div class="jobs-item__cell jobs-item__cell--meta">
                      <div class="jobs-item__type">
                        <div class={`badge badge--${item.job.contractType}`}>{getTitle(item.job.contractType, contracts)}</div>
                      </div>
                      <div class="jobs-item__date">{item.job.publishedAt}</div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>

            <!--a href="{base}#" class="btn btn--secondary btn--full">
              <i class="mdi mdi-plus-circle"></i>
              <span>Carregar mais</span>
            </a-->
          {/if}
        </div>

        <aside class="explore__cell explore__cell--aside">
          <div class="explore-post">
            <a class="explore-post__btn btn btn--primary btn--large" href="{base}/jobs/post" title="">Postar Vaga</a>
            <p class="explore-post__info">Anuncie Grátis</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</main>
