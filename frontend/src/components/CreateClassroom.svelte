<button class="button is-primary" on:click={() => modal = true}>
    <i class="fa-plus fas"></i>
</button>
<div class="modal {modal ? 'is-active' : ''}">
    <div class="modal-background" on:click={() => modal=false}></div>
    <div class="modal-content">
        <div class="box">
            <div class="notification is-danger {error ? '' : 'is-hidden'}">
                <button class="delete" on:click={() => error = false}></button>
                {reason}
            </div>
            <div class="field">
                <label class="label">Classroom Code</label>
                <div class="control">
                    <input class="input" type="text" placeholder="10x/m1" bind:value={code}>
                    <p class="help is-danger" style="display: {noCode ? 'block' : 'none'}">Please enter a code</p>
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-link {loading ? 'is-loading' : ''}" on:click={createClassroom}>Create</button>
                </div>
            </div>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => modal=false}></button>
</div>

<script>
    import axios from "axios";

    let modal, code, noCode, loading, error
    let reason = ""

    async function createClassroom() {
        if (!code) {
            noCode = true
        } else {
            noCode = false
            loading = true

            const response = await axios.post(`http://localhost:8000/api/classrooms?code=${code}&id=${localStorage.getItem("id")}`).then(res => res.data).catch(console.error)

            if (response.error) {
                reason = response.error
                loading = false
                modal = false
                code = ""
            } else {
                location.reload()
            }

        }
    }
</script>