<script lang="ts">
	import UserProfile from '$lib/components/pages/user-profile.svelte'
	import type { PageServerData } from './$types'

	export let data: PageServerData

	const { user } = data
</script>

<svelte:head>
	<title>{user.handle}'s - profile</title>
</svelte:head>

<UserProfile {user} />
