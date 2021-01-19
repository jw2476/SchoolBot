<button class="button is-primary" on:click={() => modal = true}>
    <i class="fa-plus fas"></i>
</button>
<div class="modal {modal ? 'is-active' : ''}">
    <div class="modal-background" on:click={() => modal=false}></div>
    <div class="modal-content">
        <div class="box">
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

    let modal, code, noCode, loading

    async function createClassroom() {
        if (!code) {
            noCode = true
        } else {
            noCode = false
            loading = true

            const response = await axios.get(`http://localhost:8000/api/classrooms?code=${code}&id=${localStorage.getItem("id")}`).then(res => res.data).catch(console.error)
            console.log(response)
            loading = false
            modal = false
            code = ""
        }
    }
</script>