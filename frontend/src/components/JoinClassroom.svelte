<button class="button is-primary" on:click={() => modal = true}>
    <i class="fa-plus fas"></i>
</button>
<div class="modal {modal ? 'is-active' : ''}">
    <div class="modal-background" on:click={() => modal=false}></div>
    <div class="modal-content">
        <div class="box">
            <div class="notification is-danger {error ? '' : 'is-hidden'}">
                <button class="delete" on:click={() => error = false}></button>
                Couldn't log you into EduLink, please make sure your username and password are correct
            </div>
            <div class="field">
                <label class="label">EduLink Username</label>
                <div class="control">
                    <input class="input" type="text" placeholder="17g23287" bind:value={username}>
                    <p class="help is-danger" style="display: {!username ? 'block' : 'none'}">Please enter a
                        username</p>
                </div>
            </div>
            <div class="field">
                <label class="label">EduLink Password</label>
                <div class="control">
                    <input class="input" type="password" bind:value={password}>
                    <p class="help is-danger" style="display: {!password ? 'block' : 'none'}">Please enter a
                        password</p>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link {loading ? 'is-loading' : ''}" on:click={joinClassrooms}>Join</button>
                </div>
            </div>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => modal=false}></button>
</div>

<script>
    import {axios} from "../const";

    const id = localStorage.getItem("id")

    let username, loading, modal, password, error

    async function joinClassrooms() {
        if (username && password) {
            loading = true

            const result = await axios.post(`/api/students/${id}/joinClassrooms`, {
                username,
                password
            }).then(res => res.data).catch(console.error)

            loading = false

            if (result.error) error = true
        }
    }
</script>