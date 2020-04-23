<script context="module">
  import mf from '../components/multifetch.js';

  export async function preload({ host, params, query }) {
    let baseUrl = ''
    if (!process.browser && process.env.NOW_REGION) {
	baseUrl = `https://${host}`
    }
  }
</script>

<script>
  import { stores } from '@sapper/app';

const MESSAGE_CACHE_ENDPOINT = 'https://messagecache.pandemy.xyz/api/search'
const POSTGREST_ENDPOINT = 'https://postgrest.pandemy.xyz/slack_messages'

const { preloading } = stores();
export let searchterm = "";
export let status = "idle";
export let results = [];

function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function get_results() {
    console.log( "status: ", status)
    if (status == "returning") {

      let db_params = {
	'select': `id, prev_text:message_body->"previous"->>"text",text:message_body->>"text"',
	  'message_body->>"text"': like.*${searchterm}*`,
	'limit': 10
      }

      const queryString = Object.entries(db_params).map(([key, value]) => {
	return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }).join('&')

      console.log(`${POSTGREST_ENDPOINT}?${queryString}`)
      const res = await fetch(`${POSTGREST_ENDPOINT}?${queryString}`)
      const text = await res.text();
      status = 'idle'

      if (res.status == 200 ) {
	results = JSON.parse(text);
	console.log(results)
      } else {
	throw new Error(text);
      }

      await timer(1000); // then the created Promise can be awaited
      get_results();

    }
}

async function start_search() {
  status = 'searching'
  const res = await fetch(`${MESSAGE_CACHE_ENDPOINT}?query=${searchterm}`);
  const text = await res.text();
  status = 'returning'
  get_results();
}

</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<form on:submit|preventDefault={start_search}>
  <input name="search" bind:value="{searchterm}" />
  <input type="submit" />
  {status}
</form>

count: {results.length}

<ul>
{#each results as result}
 <li>
  {result.text}
 </li>
{/each}
</ul>
