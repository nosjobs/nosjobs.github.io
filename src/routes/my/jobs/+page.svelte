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
  import { nostrProfile } from '$lib/stores/nostr.js'

  let profile

  const unsubscribe = nostrProfile.subscribe(value => {
    profile = value
  })

  let jobs = []
  let loading = true
  let error = ''

  const fetchJobs = async () => {
    const filters = { 
      kinds: [30600],
      limit: 10,
      authors: [profile.pubkey]
    }

    try {
      const events = await pool.querySync(filters)

      if (events.length > 0) {
        loading = false
        for (const event of events) {
          const data = parseJob(event)

          data.job.publishedAt = formatUnixTimestamp(data.job.publishedAt)

          data.naddr = nip19.naddrEncode({
            kind: event.kind,
            pubkey: event.pubkey,
            identifier: event.tags.find(tag => tag[0] === 'd')[1],
          })

          jobs = [...jobs, data]
        }
      } else {
        loading = false
      }
      
    } catch (err) {
      error = 'Error fetching jobs: ' + err.message
    }
  }

  onMount(() => {
    fetchJobs()
  })
</script>

<main class="main">
  <div class="wrapper">
    <div class="job">
      <div class="job__cell job__cell--main">
        <header>
          <h1 class="post__title">Minhas vagas</h1>
        </header>

        <br />

        <div>
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
      </div>
    </div>
  </div>
</main>
