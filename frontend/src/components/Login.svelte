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
    export let socket

    const params = new URLSearchParams(location.search)
    const code = params.get("code")

    let login, error

    socket.on("authenticateError", () => error = true)
    socket.on("authenticateSuccess", response => {
        localStorage.setItem("token", response.token)
    })

    if (!code) {
        login = true
    } else {
        socket.emit("authenticate", code)
    }
</script>
