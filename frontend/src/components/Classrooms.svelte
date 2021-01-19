<section class="section">
    {#if !selectedClassroom}
        <div class="columns">
            {#each classrooms as classroom}
                <div class="box has-text-centered column is-one-third" id="classroom">
                    <h1 class="title">{classroom.code}</h1>
                    <button class="button is-primary" on:click={() => selectedClassroom = classroom}>Enter</button>
                </div>
            {/each}
        </div>
    {:else}
        <Classroom classroom={selectedClassroom} id/>
    {/if}
    {#if error}
        <div class="container has-text-centered">
            <h1 class="title is-danger">An error occurred when trying to get your classrooms, please reload</h1>
        </div>
    {/if}
</section>


<script>
    import axios from "axios"
    import {onMount} from "svelte";
    import Classroom from "./Classroom.svelte";

    let error, selectedClassroom
    let classrooms = []

    onMount(async () => {
        classrooms = await axios.get(`http://localhost:8000/api/teachers/${localStorage.getItem("id")}/classrooms`).then(res => res.data).catch(err => { console.error(err); return []})

        if (!classrooms || classrooms.error) {
            error = true
            classrooms = []
        } else {
            console.log(classrooms)
        }
    })
</script>

<style>
    #classroom {
        margin-left: 16px;
        margin-bottom: 0;
    }
</style>