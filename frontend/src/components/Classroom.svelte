<div class="has-text-centered">
    <h1 class="title">{classroom.code}</h1>
    {#each students as student}
        student.id
    {/each}
    {#if error}
        <h1 class="title">Could not get students, try reloading</h1>
    {/if}
</div>

<script>
    import {onMount} from "svelte";
    import axios from "axios";

    export let classroom;

    let error
    let students = []

    onMount(async () => {
        const {students} = classroom

        if (!students || students.error) {
            error = true
        }
    })
</script>