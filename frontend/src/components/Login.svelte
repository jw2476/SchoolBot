<section class="section">
    <div class="container has-text-centered">
        {#if login}
            <h1 class="title">Press the button below to login</h1>
            <a href={`https://discord.com/api/oauth2/authorize?client_id=796713070750990368&redirect_uri=${redirectURI}&response_type=code&scope=identify`}>
                <button class="is-large is-primary button">Login</button>
            </a>
        {:else if error}
            <h1 class="title is-danger">An error has occurred, this can usually be fixed by refreshing the page.</h1>
            <a href="/">
                <button class="button is-danger">Reload</button>
            </a>
        {/if}
    </div>
</section>

<script>
    import {onMount} from "svelte";
    import {axios} from "../const";

    const params = new URLSearchParams(location.search)
    const code = params.get("code")
    const redirectURI = encodeURIComponent(location.protocol + '//' + location.host + location.pathname.slice(location.pathname.length))

    let login, error

    onMount(async () => {
        if (!code) {
            login = true
        } else {
            const auth = await axios.get(`/api/auth?code=${code}`).then(res => res.data)

            if (!auth || auth.error) {
                error = true
            }  else {
                localStorage.setItem("token", auth.token)
                localStorage.setItem("name", auth.user.username)
                localStorage.setItem("id", auth.user.id)
                location.reload()
            }
        }
    })
</script>
