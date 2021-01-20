<h1 class="title has-text-centered">{classroom.code}</h1>
<div class="columns">
    <div class="column is-one-third">
        <div class="box content">
            <h1 class="title has-text-centered">Students</h1>
            <br>
            <ul>
                {#each students as student}
                    <li>{student}</li>
                {/each}
            </ul>
        </div>
    </div>
    {#if userType === "teacher"}
        <div class="column is-one-third">
            <div class="box content">
                <h1 class="title has-text-centered">Control Panel</h1>
                <div class="buttons">
                    <button class="button is-primary {loading ? 'is-loading' : ''}"
                            on:click={splitMerge}>{tableMode ? "Merge" : "Split"}</button>
                </div>
            </div>
        </div>
    {/if}
    <div class="modal {modal ? 'is-active' : ''}">
        <div class="modal-background" on:click={() => modal = false}></div>
        <div class="modal-content box">
            <div class="field">
                <label class="label">Amount of Tables</label>
                <div class="control">
                    <input class="input" type="text" placeholder="6" bind:value={amount}>
                </div>
                {#if amountError}
                    <p class="help is-danger">Not a number, eg 3 or 5</p>
                {/if}
            </div>
            <button class="button is-primary {loading ? 'is-loading' : ''}" on:click={splitMerge}>Split</button>
        </div>
        <button class="modal-close is-large" aria-label="close" on:click={() => modal = false}></button>
    </div>
</div>

<script>
    import {onMount} from "svelte";
    import axios from "axios";
    import {type} from "../stores";

    export let classroom;

    let amountError, loading, userType, modal
    let students = []
    let tableMode = false // False: Split, True: Merge
    let amount = ""

    type.subscribe(value => userType = value)

    onMount(async () => {
        const studentsDB = classroom.students

        for (const studentDB of studentsDB) {
            students = [...students, await axios.get(`http://localhost:8000/api/students/${studentDB.id}/name`).then(res => res.data)] // Svelte only updates on reassignment
        }

        console.log(students)
    })

    async function splitMerge() {
        if (!modal && !tableMode) {
            modal = true;
            return
        }

        let amountInt = 0

        if (!tableMode) {
            amountInt = parseInt(amount)

            if (!amountInt) {
                amountError = true
                return
            }
        }

        amountError = false
        loading = true
        await axios.post(`http://localhost:8000/api/classrooms/${classroom._id}/${tableMode ? "merge" : "split"}`, {amount: amountInt})
        loading = false
        modal = false
        tableMode = !tableMode
    }
</script>