<section class="section">
    <div class="container has-text-centered">
        {#if login}
            <h1 class="title">Press to button below to login</h1>
            <a href="https://discord.com/api/oauth2/authorize?client_id=796713070750990368&redirect_uri=http%3A%2F%2Flocalhost%3A5000&response_type=code&scope=identify">
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

    const params = new URLSearchParams(location.search)
    const code = params.get("code")

    let login, error

    onMount(async () => {
        if (!code) {
            login = true
        } else {
            const auth = await fetch(`http://localhost:8000/api/auth?code=${code}`).then(res => res.json()).catch(err => {console.error(err)})

            if (!auth || auth.error) {
                error = true
            }  else {
                localStorage.setItem("token", auth.token)
                localStorage.setItem("name", auth.user.username)
                localStorage.setItem("id", auth.user.id)
            }
        }
    })
</script>
