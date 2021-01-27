<button class="delete" on:click={() => modal=true}></button>
<div class="modal {modal ? 'is-active' : ''}">
    <div class="modal-background" on:click={() => modal=false}></div>
    <div class="modal-content">
        <div class="box">
            <h1 class="title is-danger">Are you sure you want to delete this classroom?</h1>
            <div class="buttons">
                <button class="button is-danger {loading ? 'is-loading' : ''}" on:click={deleteClassroom}>Delete
                </button>
                <button class="button" on:click={() => modal=false}>Cancel</button>
            </div>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => modal=false}></button>
</div>

<script>
    import {axios} from "../const";

    let modal, loading
    export let classroom

    async function deleteClassroom() {
        loading = true
        await axios.delete(`/api/classrooms/${classroom._id}`)
        location.reload()
    }
</script>